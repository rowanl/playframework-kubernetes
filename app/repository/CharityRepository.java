package repository;

import io.ebean.EbeanServer;
import models.Charity;
import play.db.ebean.EbeanConfig;
import play.db.ebean.EbeanDynamicEvolutions;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletionStage;
import java.util.function.Supplier;

import static io.ebean.Ebean.getServer;
import static java.util.Optional.ofNullable;
import static java.util.concurrent.CompletableFuture.supplyAsync;

@Singleton
public class CharityRepository {

    private final EbeanServer ebeanServer;
    private final DatabaseExecutionContext executionContext;

    @Inject
    public CharityRepository(EbeanConfig ebeanConfig, DatabaseExecutionContext executionContext,
                             @SuppressWarnings("unused")
                                     EbeanDynamicEvolutions ebeanDynamicEvolutions /* Required for Ebean/DI bug */) {
        this.ebeanServer = getServer(ebeanConfig.defaultServer());
        this.executionContext = executionContext;
    }

    private <T> CompletionStage<T> wrapContext(Supplier<T> toRun) {
        return supplyAsync(toRun, executionContext);
    }

    public CompletionStage<List<Charity>> findList() {
        return wrapContext(() -> ebeanServer.find(Charity.class).findList());
    }

    public CompletionStage<Optional<Charity>> findById(int id) {
        return wrapContext(() -> ofNullable(ebeanServer.find(Charity.class).setId(id).findUnique()));
    }

    public CompletionStage<Optional<Charity>> vote(int id) {
        return wrapContext(() ->
                ofNullable(ebeanServer.find(Charity.class).setId(id).findUnique()).map(c -> {
                    c.voteCount += 1;
                    c.update();
                    return c;
                }));
    }
}
