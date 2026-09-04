-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.teacher (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  id uuid NOT NULL DEFAULT auth.uid(),
  email text UNIQUE,
  CONSTRAINT teacher_pkey PRIMARY KEY (id),
  CONSTRAINT teacher_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.class (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  class_name text,
  academic_term text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  teacher_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT class_pkey PRIMARY KEY (id),
  CONSTRAINT class_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teacher(id)
);
CREATE TABLE public.subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subject_name text,
  class_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT subjects_pkey PRIMARY KEY (id),
  CONSTRAINT subjects_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.class(id)
);
CREATE TABLE public.scheme_of_work (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  term text,
  academic_year text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  subject_id uuid,
  CONSTRAINT scheme_of_work_pkey PRIMARY KEY (id),
  CONSTRAINT scheme_of_work_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.topics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  objectives text,
  week smallint,
  scheme_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT topics_pkey PRIMARY KEY (id),
  CONSTRAINT topics_scheme_id_fkey FOREIGN KEY (scheme_id) REFERENCES public.scheme_of_work(id)
);
CREATE TABLE public.lesson_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text,
  AI_prompt text,
  status text,
  topic_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lesson_notes_pkey PRIMARY KEY (id),
  CONSTRAINT lesson_notes_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id)
);