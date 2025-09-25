-- Force token regeneration with new RESO scopes by clearing existing tokens
DELETE FROM oauth_tokens WHERE provider = 'realtyna';