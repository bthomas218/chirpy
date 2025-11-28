ALTER TABLE "posts" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(256) DEFAULT 'unset' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;