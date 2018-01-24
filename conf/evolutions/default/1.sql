# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table charity (
  id                            integer auto_increment not null,
  name                          varchar(255),
  short_name                    varchar(255),
  url                           varchar(255),
  description                   varchar(255),
  image                         varchar(255),
  image_alt                     varchar(255),
  vote_count                    integer,
  constraint pk_charity primary key (id)
);


# --- !Downs

drop table if exists charity;

