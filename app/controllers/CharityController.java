package controllers;

import com.typesafe.config.Config;
import models.Charity;
import org.jetbrains.annotations.NotNull;
import play.Logger;
import play.data.DynamicForm;
import play.data.FormFactory;
import play.filters.csrf.AddCSRFToken;
import play.filters.csrf.RequireCSRFCheck;
import play.libs.concurrent.HttpExecutionContext;
import play.mvc.Http.Cookie;
import play.mvc.Result;
import play.twirl.api.Html;
import repository.CharityRepository;
import views.html.vote;
import views.html.voteIndex;

import javax.inject.Inject;
import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;
import java.util.function.Supplier;

import static java.lang.Integer.parseInt;
import static java.time.Instant.ofEpochMilli;
import static java.time.LocalDateTime.now;
import static java.time.LocalDateTime.ofInstant;
import static java.util.Optional.ofNullable;
import static java.util.concurrent.CompletableFuture.completedFuture;
import static play.mvc.Http.Context.Implicit.request;
import static play.mvc.Results.*;

public class CharityController {

    private final CharityRepository charityRepository;
    private final HttpExecutionContext ec;
    private final FormFactory formFactory;
    private final LocalDateTime endDateTime;
    private final Clock clock;

    @Inject
    public CharityController(CharityRepository charityRepository,
                             HttpExecutionContext ec,
                             FormFactory formFactory,
                             Clock clock,
                             Config config) {
        this.charityRepository = charityRepository;
        this.ec = ec;
        this.formFactory = formFactory;
        this.clock = clock;
        long endTimeAsEpochMilli = config.getLong("charity.end-time");
        String zonedIdAsString = config.getString("time.zone-id");
        this.endDateTime = ofInstant(ofEpochMilli(endTimeAsEpochMilli), ZoneId.of(zonedIdAsString));
    }

    public Result redirectToIndex(){
        return redirect(routes.CharityController.index());
    }

    @AddCSRFToken
    public CompletionStage<Result> index() {
        return charityRepository.findList().thenApplyAsync(items ->
                timeSensitiveResult(() -> voteIndex.render(items)), ec.current());
    }

    @RequireCSRFCheck
    public CompletionStage<Result> donate() {

        DynamicForm requestData = formFactory.form().bindFromRequest();

        int id = getIdFrom(requestData);

        if (id == 0) {
            return completedFuture(badRequest());
        }

        return ofNullable(request().cookie("voted")) // Stop spam
                .map(Cookie::value)
                .map("true"::equals)
                .map(ignored -> charityRepository.findById(id)
                        .thenApplyAsync(mapCharityToResult(charity ->
                                timeSensitiveResult(() -> vote.render(charity)))))
                .orElseGet(() -> charityRepository.vote(id)
                        .thenApplyAsync(mapCharityToResult(charity ->
                                timeSensitiveResult(() -> vote.render(charity)).withCookies(createVotedCookie()))));
    }

    private int getIdFrom(DynamicForm requestData) {
        int id = 0;
        try {
            id = parseInt(requestData.get("id"));
        } catch (NumberFormatException nfe) {
            Logger.error("Could not parse id as int", nfe);
        }
        return id;
    }

    @NotNull
    private Function<Optional<Charity>, Result> mapCharityToResult(Function<Charity, Result> resultFromCharity) {
        return maybeCharity -> maybeCharity
                .map(resultFromCharity)
                .orElse(notFound("Charity not found"));
    }

    private Result timeSensitiveResult(Supplier<Html> pageToRender) {
        if (isAfterEndDateTime()) {
            return movedPermanently(routes.ClosedController.index());
        } else {
            return ok(pageToRender.get());
        }
    }

    @AddCSRFToken
    public CompletionStage<Result> donateCount() {
        return charityRepository.findList().thenApplyAsync(items -> ok(views.html.voteCount.render(items)), ec.current());
    }

    private Cookie createVotedCookie() {
        return Cookie.builder("voted", "true")
                .withMaxAge(Duration.ofSeconds(3600000))
                .withPath("/")
                .withSecure(false)
                .withHttpOnly(true)
                .withSameSite(Cookie.SameSite.STRICT)
                .build();
    }

    private boolean isAfterEndDateTime() {
        return endDateTime.isBefore(now(clock));
    }
}