package repository;

import io.ebean.CallableSql;
import models.Charity;
import org.junit.Before;
import org.junit.Test;
import play.test.WithApplication;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

import static io.ebean.Ebean.getDefaultServer;
import static java.util.Arrays.asList;
import static java.util.Optional.empty;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

public class CharityRepositoryTest extends WithApplication {

    private CharityRepository repository;

    @Before
    public void setUp() {
        repository = instanceOf(CharityRepository.class);

        CallableSql cleanCharityTable = getDefaultServer().createCallableSql("delete from charity");
        getDefaultServer().execute(cleanCharityTable);
    }

    @Test
    public void Given_CharityObjectsExist_When_FindListIsCalled_Then_AllCharityObjectsAreReturned() {

        // GIVEN
        Charity c1 = new Charity();
        c1.id = 1;
        Charity c2 = new Charity();
        c2.id = 2;
        Charity c3 = new Charity();
        c3.id = 3;
        Charity c4 = new Charity();
        c4.id = 4;

        getDefaultServer().saveAll(asList(c1, c2, c3, c4));

        // WHEN
        List<Charity> result = repository.findList().toCompletableFuture().join();

        // THEN
        assertThat(result.size(), is(4));
    }

    @Test
    public void Given_CharityObjectExistsAndIdIsValid_When_FindByIdIsCalled_Then_CorrectCharityObjectIsReturned() {

        // GIVEN
        Charity c1 = new Charity();
        c1.id = 1;

        c1.save();

        // WHEN
        Optional<Charity> result = repository.findById(1).toCompletableFuture().join();

        // THEN
        assertThat(result.orElse(null), is(equalTo(c1)));
    }

    @Test
    public void Given_NoCharityObjectExists_When_FindByIdIsCalled_Then_EmptyOptionalIsReturned() {

        // GIVEN

        // WHEN
        Optional<Charity> result = repository.findById(1).toCompletableFuture().join();

        // THEN
        assertThat(result, is(empty()));
    }

    @Test
    public void Given_CharityObjectExists_When_VoteIsCalled_Then_VoteCountIsUpdated() {

        // GIVEN
        Charity c1 = new Charity();
        c1.id = 1;
        c1.voteCount = 2;

        c1.save();

        // WHEN
        Optional<Charity> result = repository.vote(1).toCompletableFuture().join();

        // THEN
        Charity resultingCharity = result.orElseThrow(EntityNotFoundException::new);
        assertThat(resultingCharity, is(equalTo(c1)));
        assertThat(resultingCharity.voteCount, is(3));
    }

    @Test
    public void Given_NoCharityObjectExists_When_VoteIsCalled_Then_EmptyOptionalIsReturned() {

        // GIVEN

        // WHEN
        Optional<Charity> result = repository.vote(1).toCompletableFuture().join();

        // THEN
        assertThat(result, is(empty()));
    }
}
