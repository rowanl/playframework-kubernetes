package controllers;

import com.google.inject.AbstractModule;
import org.junit.Test;
import play.Application;
import play.inject.guice.GuiceApplicationBuilder;
import play.libs.ws.WSResponse;
import play.mvc.Http;
import play.test.WithServer;

import java.time.Clock;
import java.time.ZoneId;

import static java.time.Duration.ofSeconds;
import static java.time.Instant.ofEpochMilli;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static play.mvc.Http.Cookie.SameSite.STRICT;
import static play.mvc.Http.Cookie.builder;
import static play.mvc.Http.Status.*;
import static play.test.WSTestClient.newClient;

public class CharityControllerTest extends WithServer {

    private Clock clock;

    @Override
    protected Application provideApplication() {
        return new GuiceApplicationBuilder()
                .overrides(bindClockToMockInstance())
                .build();
    }

    private AbstractModule bindClockToMockInstance() {
        return new AbstractModule() {
            @Override
            protected void configure() {
                bind(Clock.class).toInstance(clock = mock(Clock.class));
            }
        };
    }

    @Test
    public void Given_IsAfterEndDate_When_GetRequestIsMadeToIndexPage_Then_StatusIs301AndLocationHeaderEqClosed() {

        //GIVEN
        long afterEndDate = 11L;
        given(clock.instant()).willReturn(ofEpochMilli(afterEndDate));
        given(clock.getZone()).willReturn(ZoneId.of("+0"));

        // WHEN
        WSResponse result = newClient(providePort()).url("/").get().toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(MOVED_PERMANENTLY));
        assertThat(result.getSingleHeader("Location").orElse(null), is(equalTo("/closed")));
    }

    @Test
    public void Given_IsBeforeEndDate_When_GetRequestIsMadeToIndexPage_Then_StatusIs200() {

        // GIVEN
        long beforeEndDate = 9L;
        given(clock.instant()).willReturn(ofEpochMilli(beforeEndDate));
        given(clock.getZone()).willReturn(ZoneId.of("+0"));

        // WHEN
        WSResponse result = newClient(providePort()).url("/").get().toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(OK));
    }

    @Test
    public void Given_AlreadyVotedAndAfterEndDate_When_PostRequestIsMadeToDonate_Then_StatusIs301AndLocationHeaderEqClosed() {

        // GIVEN
        long beforeEndDate = 11L;
        given(clock.instant()).willReturn(ofEpochMilli(beforeEndDate));
        given(clock.getZone()).willReturn(ZoneId.of("+0"));
        String body = "id=1";
        Http.Cookie alreadyVotedCookie = builder("voted", "true")
                .withMaxAge(ofSeconds(3600000))
                .withPath("/")
                .withSecure(false)
                .withHttpOnly(true)
                .withSameSite(STRICT)
                .build();

        // WHEN
        WSResponse result = newClient(providePort()).url("/donate")
                .addCookie(alreadyVotedCookie)
                .addHeader("Csrf-Token", "No-Check")
                .setContentType("application/x-www-form-urlencoded")
                .post(body)
                .toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(MOVED_PERMANENTLY));
        assertThat(result.getSingleHeader("Location").orElse(null), is(equalTo("/closed")));
    }

    @Test
    public void Given_AlreadyVotedAndBeforeEndDate_When_PostRequestIsMadeToDonate_Then_StatusIs200() {

        // GIVEN
        long beforeEndDate = 9L;
        given(clock.instant()).willReturn(ofEpochMilli(beforeEndDate));
        given(clock.getZone()).willReturn(ZoneId.of("+0"));
        String body = "id=1";
        Http.Cookie alreadyVotedCookie = builder("voted", "true")
                .withMaxAge(ofSeconds(3600000))
                .withPath("/")
                .withSecure(false)
                .withHttpOnly(true)
                .withSameSite(STRICT)
                .build();

        // WHEN
        WSResponse result = newClient(providePort()).url("/donate")
                .addCookie(alreadyVotedCookie)
                .addHeader("Csrf-Token", "No-Check")
                .setContentType("application/x-www-form-urlencoded")
                .post(body)
                .toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(OK));
    }

    @Test
    public void Given_HaveNotVotedAndBeforeEndDateAndCharityIdInvalid_When_PostRequestIsMadeToDonate_Then_StatusIs404() {

        // GIVEN
        long beforeEndDate = 9L;
        given(clock.instant()).willReturn(ofEpochMilli(beforeEndDate));
        given(clock.getZone()).willReturn(ZoneId.of("+0"));
        String body = "id=-1";

        // WHEN
        WSResponse result = newClient(providePort()).url("/donate")
                .addHeader("Csrf-Token", "No-Check")
                .setContentType("application/x-www-form-urlencoded")
                .post(body)
                .toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(NOT_FOUND));
    }

    @Test
    public void Given_HaveNotVotedAndAfterEndDate_When_PostRequestIsMadeToDonate_Then_StatusIs301AndLocationHeaderEqClosed() {

        // GIVEN
        long beforeEndDate = 11L;
        given(clock.instant()).willReturn(ofEpochMilli(beforeEndDate));
        given(clock.getZone()).willReturn(ZoneId.of("+0"));
        String body = "id=1";

        // WHEN
        WSResponse result = newClient(providePort()).url("/donate")
                .addHeader("Csrf-Token", "No-Check")
                .setContentType("application/x-www-form-urlencoded")
                .post(body)
                .toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(MOVED_PERMANENTLY));
        assertThat(result.getSingleHeader("Location").orElse(null), is(equalTo("/closed")));
    }

    @Test
    public void Given_HaveNotVotedAndBeforeEndDate_When_PostRequestIsMadeToDonate_Then_StatusIs200AndVotedCookieIsPresent() {

        // GIVEN
        long beforeEndDate = 9L;
        given(clock.instant()).willReturn(ofEpochMilli(beforeEndDate));
        given(clock.getZone()).willReturn(ZoneId.of("+0"));
        String body = "id=1";

        // WHEN
        WSResponse result = newClient(providePort()).url("/donate")
                .addHeader("Csrf-Token", "No-Check")
                .setContentType("application/x-www-form-urlencoded")
                .post(body)
                .toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(OK));
    }

    @Test
    public void Given_InvalidIdIsSent_When_PostRequestIsMadeToDonate_Then_StatusIs400() {

        // GIVEN
        String body = "id=abc";

        // WHEN
        WSResponse result = newClient(providePort()).url("/donate")
                .addHeader("Csrf-Token", "No-Check")
                .setContentType("application/x-www-form-urlencoded")
                .post(body)
                .toCompletableFuture().join();

        // THEN
        assertThat(result.getStatus(), is(BAD_REQUEST));
    }
}
