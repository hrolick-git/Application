-- Data cleanup: legacy default 'violet' should now be treated as no theme
UPDATE "Event"
SET "colorTheme" = NULL
WHERE "colorTheme" = 'violet';
