-- Clear existing tokens to force regeneration with new RESO scopes
DELETE FROM oauth_tokens WHERE provider = 'realtyna';