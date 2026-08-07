-- ============================================================================
-- SoftSync Lab — Demo seed data for the training module
--
-- Run AFTER schema.sql. Gives you one demo intern, one module, lessons, and a
-- quiz so you can test the intern flow before entering real content.
--
-- Demo intern login: PIN 1234
-- ============================================================================

-- 1) Demo intern (PIN: 1234, hashed)
select public.admin_create_intern('Demo Intern', 'demo@softsyncsolutions.in', '1234', 'Internship');

-- 2) Module: Business Automation Foundations
insert into public.modules (title, description, order_index)
values (
    'Business Automation Foundations',
    'Core concepts: automation workflows, AI content pipelines, and customer journey automation.',
    1
);

-- 3) Lessons for that module
insert into public.lessons (module_id, title, content_md, order_index)
values
(
    (select id from public.modules order by order_index limit 1),
    'What is Business Automation?',
    '## What is Business Automation?\n\nBusiness automation uses software to handle repetitive tasks so your team can focus on higher-value work.\n\n### Common areas\n- Marketing content generation\n- Lead management\n- Order processing\n- Customer communication\n\n### Why it matters\nAutomation reduces manual effort, removes human error, and scales output without scaling headcount.',
    1
),
(
    (select id from public.modules order by order_index limit 1),
    'Automation Workflows',
    '## Automation Workflows\n\nA workflow is a sequence of steps that run automatically when triggered.\n\n### Example trigger\nA new lead fills out a form -> workflow adds them to a CRM, sends a welcome email, and notifies sales.\n\n### Tools we use\n- No-code platforms\n- AI APIs\n- Integration tools (webhooks, Zapier-style connectors)',
    2
),
(
    (select id from public.modules order by order_index limit 1),
    'AI Content Pipelines',
    '## AI Content Pipelines\n\nBuild end-to-end pipelines that turn an idea into finished content (images, video, voiceover, copy).\n\n### Pipeline stages\n1. Idea & brief\n2. Script / prompt generation\n3. Asset generation\n4. Review & publish',
    3
);

-- 4) Quiz for the module
insert into public.quizzes (module_id, title, pass_percent)
values
(
    (select id from public.modules order by order_index limit 1),
    'Business Automation Foundations — Assessment',
    70
);

-- 5) Quiz questions
insert into public.quiz_questions (quiz_id, question, options, correct_index, order_index)
values
(
    (select id from public.quizzes order by created_at desc limit 1),
    'What is the primary purpose of business automation?',
    '["To replace all human workers", "To handle repetitive tasks so teams focus on higher-value work", "To make websites load faster", "To reduce the need for software"]'::jsonb,
    1,
    1
),
(
    (select id from public.quizzes order by created_at desc limit 1),
    'Which of the following is an example of a workflow trigger?',
    '["A new lead fills out a form", "A colour change on the website", "A printer running out of ink", "A change in the weather"]'::jsonb,
    0,
    2
),
(
    (select id from public.quizzes order by created_at desc limit 1),
    'What is the first stage of an AI content pipeline?',
    '["Publish", "Review", "Idea & brief", "Script generation"]'::jsonb,
    2,
    3
),
(
    (select id from public.quizzes order by created_at desc limit 1),
    'What does automation help scale without increasing?',
    '["Quality", "Headcount", "Brand value", "Customer trust"]'::jsonb,
    1,
    4
);
