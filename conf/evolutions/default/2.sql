# --- !Ups

insert into charity (id, name, short_name, url, description, image, image_alt, vote_count) values ( 1,'Code2040', 'code2040', 'http://www.code2040.org', 'Based in SF and working across the US, Code2040 is diversifying tech to create a more equitable, inclusive, and prosperous economy. Their goal is to see Black and Latinx people fully represented in the innovation economy by 2040.','codeimage.png','Students at computers in a classroom', 0);
insert into charity (id, name, short_name, url, description, image, image_alt, vote_count) values ( 2,'Electronic Frontier Foundation', 'eff', 'https://www.eff.org', 'Electronic Frontier Foundation has been defending net neutrality and other digital rights and freedoms since 1990. This work is ever more important as our dependence on technology grows.','electronicimage.png','A group of people holding a sign saying save the internet in front of the White House', 0);
insert into charity (id, name, short_name, url, description, image, image_alt, vote_count) values ( 3,'Women''s Foundation of California', 'womens-foundation-california','https://womensfoundca.org', 'The Women''s Foundation of California is a public foundation dedicated to achieving gender, racial, and economic justice by empowering women and trans people to become policy makers and influencers.','womensimage.png','Four women''s head shots against a red background', 0);

# --- !Downs

delete from charity;