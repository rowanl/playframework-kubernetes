import com.google.inject.AbstractModule;

import java.time.Clock;

import static java.time.Clock.systemUTC;

public class Module extends AbstractModule {

    @Override
    protected void configure() {
        bind(Clock.class).toInstance(systemUTC());
    }
}
