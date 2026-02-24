export const DEFAULT_USER_FIELDS = [
  "id",
  "name",
  "username",
  "created_at",
  "description",
  "location",
  "public_metrics",
  "profile_image_url",
  "protected",
  "url",
  "verified",
  "verified_type",
] as const;

export const DEFAULT_TWEET_FIELDS = [
  "id",
  "text",
  "created_at",
  "author_id",
  "public_metrics",
  "conversation_id",
  "in_reply_to_user_id",
  "referenced_tweets",
  "entities",
  "lang",
] as const;

export const DEFAULT_TWEET_EXPANSIONS = [
  "author_id",
  "referenced_tweets.id",
] as const;
