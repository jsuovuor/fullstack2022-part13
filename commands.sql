
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INT DEFAULT 0
);


insert into blogs (author, url, title) values ('Matti Meikäläinen', 'www.url.url', 'Kertomuksia');
insert into blogs (author, url, title, likes) values ('Jaana Javascriptaaja', 'www.123.321', 'Javascript juttuja', 10);