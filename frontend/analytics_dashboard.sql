-- 1. Daily Unique Visitors (based on Session ID)
-- Run this to create a "View" you can verify easily
CREATE OR REPLACE VIEW daily_traffic AS
SELECT 
    date_trunc('day', created_at) as day, 
    count(distinct session_id) as unique_visitors,
    count(*) as total_pageviews
FROM analytics_events
WHERE event_name = 'page_view'
GROUP BY 1
ORDER BY 1 DESC;

-- 2. Daily Waitlist Signups
CREATE OR REPLACE VIEW daily_signups AS
SELECT 
    date_trunc('day', created_at) as day, 
    count(*) as signups
FROM waitlist
GROUP BY 1
ORDER BY 1 DESC;

-- 3. Top Referral Sources (Where users are coming from)
CREATE OR REPLACE VIEW top_referrers AS
SELECT 
    referrer, 
    count(distinct session_id) as unique_visits
FROM analytics_events
WHERE referrer IS NOT NULL AND referrer != ''
GROUP BY 1
ORDER BY 2 DESC;

-- 4. Average Session Duration (Time on Site)
CREATE OR REPLACE VIEW avg_session_duration AS
SELECT 
    date_trunc('day', created_at) as day,
    AVG(duration_minutes) as avg_minutes
FROM (
    SELECT 
        session_id,
        MIN(created_at) as start_time,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 60 as duration_minutes
    FROM analytics_events
    GROUP BY session_id
) session_stats
GROUP BY 1
ORDER BY 1 DESC;
