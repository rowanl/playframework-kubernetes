import play.ebean.sbt.PlayEbean
import play.sbt.PlayJava
import sbt.{TestFrameworks, Tests}

name := """sf-xmas"""
organization := "com.bynd"

version := "1.0-SNAPSHOT"

lazy val `sf-xmas` = (project in file(".")).enablePlugins(PlayJava, PlayEbean)

scalaVersion := "2.12.2"

libraryDependencies += guice
libraryDependencies += jdbc
libraryDependencies += ws
libraryDependencies += evolutions
libraryDependencies += "com.h2database" % "h2" % "1.4.194"

libraryDependencies += "org.awaitility" % "awaitility" % "2.0.0" % Test
libraryDependencies += "org.assertj" % "assertj-core" % "3.6.2" % Test
libraryDependencies += "org.mockito" % "mockito-core" % "2.1.0" % Test
libraryDependencies += javaJdbc % Test

testOptions in Test += Tests.Argument(TestFrameworks.JUnit, "-a", "-v")

Keys.fork in Test := true
javaOptions in Test ++= Seq("-Dconfig.file=conf/application.test.conf")
parallelExecution in Test := false