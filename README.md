# SF XMAS

This application is based on PlayFramework and uses an in memory database H2 in order to receive donation pledges for a 
specific charity.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing 
purposes.

## Development Dependencies

```
java8
```

```
sbt
``` 

```
docker
```

## Running The Application

### From The Terminal

To run the application please invoke the following command:

```
sbt run
```
This will start the server in dev mode listening on port 9000. 

```
$ sbt run
[info] Loading settings from idea.sbt ...
[info] Loading global plugins from /.sbt/1.0/plugins
[info] Loading settings from plugins.sbt,scaffold.sbt ...
[info] Loading project definition from /sf-xmas/project
[info] Loading settings from build.sbt ...
[info] Set current project to sf-xmas (in build file:/sf-xmas/)

--- (Running the application, auto-reloading is enabled) ---

[info] p.c.s.AkkaHttpServer - Listening for HTTP on /0:0:0:0:0:0:0:0:9000
``` 

### Docker

To run in production mode inside a Docker container we first have to build the image. E.g.

```
docker build -t sf-xmas:$(git log -1 --pretty=%H) .
```

The aforementioned command will build the image and tag it with the latest commit hash.

To run said image:

```
docker run -p 9000:9000 sf-xmas:$(git log -1 --pretty=%H) 
```

## Running The Tests

### From The Terminal

To execute the entire test suite run this command:

```
sbt test
```

A subset of tests may be executed with a simple glob pattern. For instance:

```
sbt testOnly *Repo*
```

### From Inside Intellij

If you're running/debugging the tests through Intellij you may need to instruct it as to the whereabouts of the test 
conf lives as sometimes it does not find it. This can be done by adding the below VM option:

```
-Dconfig.file=conf/application.test.conf
```

### Coding Style For Tests

The tests are clean, with clear and distinct blocks representing the context, event, and assertions. The naming of 
tests is verbose, and is in the format of ```Given_Context_When_Event_Then_Assert```. The mantra here is to maximise
clarity and readability.

```
@Test
public void Given_CharityObjectsExist_When_FindListIsCalled_Then_AllCharityObjectsAreReturned() {
    
   // GIVEN
   rangeClosed(1, 4).boxed().map(Charity::new).forEach(Model::save);
    
   // WHEN
   List<Charity> result = repository.findList().toCompletableFuture().join();
    
   // THEN
   assertThat(result.size(), is(4));
}
```

## Deploying

When deploying to production:

* Make sure the version is correct in the Dockerfile. 

* Make sure the image has been pushed to your chosen registry.

## Built With

[Play Framework](https://www.playframework.com/)

[Docker](https://www.docker.com/)