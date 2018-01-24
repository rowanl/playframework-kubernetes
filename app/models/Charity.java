package models;

import io.ebean.Model;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Entity;

@Entity
@Table(name="charity")
public class Charity extends Model {

    @Id
    public Integer id;

    @Column(name="name")
    public String name;

    @Column(name="short_name")
    public String shortName;

    @Column(name="url")
    public String url;

    @Column(name="description")
    public String description;

    @Column(name="image")
    public String image;

    @Column(name="image_alt")
    public String imageAlt;

    @Column(name="vote_count")
    public Integer voteCount;
}