CREATE DATABASE IF NOT EXISTS `fittrix_db` DEFAULT character set utf8mb4;
USE `fittrix_db`;

create table if not exists exercise_comments
(
    exercise_comment_idx int auto_increment
    primary key,
    exercise_post_idx    int      not null,
    user_idx             int      not null,
    comment              longtext not null,
    comment_dt           datetime not null
);

create table if not exists exercise_photos
(
    exercise_photos_idx int auto_increment
    primary key,
    exercise_post_idx   int          not null,
    photo_url           varchar(200) not null
    )
    collate = utf8mb4_unicode_ci;

create table if not exists exercise_posts
(
    exercise_post_idx int auto_increment
    primary key,
    user_idx          int         not null,
    exercise_tp       int         not null,
    title             varchar(50) not null,
    contents          longtext    not null,
    post_dt           datetime    not null,
    update_user_idx   int         not null,
    update_dt         datetime    not null
    )
    collate = utf8mb4_unicode_ci;

create table if not exists logined_users
(
    logined_users_idx int auto_increment
    primary key,
    user_idx          int          not null,
    authorized_token  varchar(300) not null,
    refresh_token     varchar(150) not null,
    login_dt          datetime     not null,
    expire_dt         datetime     not null
    )
    collate = utf8mb4_unicode_ci;

create table if not exists users
(
    user_idx        int auto_increment
    primary key,
    user_id         varchar(20)   not null,
    password        varchar(100)  not null,
    user_permission int default 1 not null
    )
    collate = utf8mb4_unicode_ci;

