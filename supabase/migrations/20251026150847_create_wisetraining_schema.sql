/*
  # WiseTraining Database Schema

  ## Overview
  This migration creates the complete database schema for WiseTraining, a corporate training platform
  with microfrontend and microservices architecture.

  ## 1. New Tables

  ### `companies`
  - `id` (uuid, primary key) - Unique company identifier
  - `name` (text) - Company name
  - `email` (text, unique) - Company email for login
  - `password_hash` (text) - Hashed password
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `employees`
  - `id` (uuid, primary key) - Unique employee identifier
  - `company_id` (uuid, foreign key) - References companies
  - `name` (text) - Employee name
  - `email` (text) - Employee email
  - `created_at` (timestamptz) - Registration timestamp

  ### `groups`
  - `id` (uuid, primary key) - Unique group identifier
  - `company_id` (uuid, foreign key) - References companies
  - `name` (text) - Group name
  - `description` (text) - Group description
  - `created_at` (timestamptz) - Creation timestamp

  ### `group_members`
  - `id` (uuid, primary key) - Unique member record
  - `group_id` (uuid, foreign key) - References groups
  - `employee_id` (uuid, foreign key) - References employees
  - `added_at` (timestamptz) - Timestamp when added to group

  ### `courses`
  - `id` (uuid, primary key) - Unique course identifier
  - `owner_company_id` (uuid, foreign key) - Company that owns/created the course
  - `title` (text) - Course title
  - `description` (text) - Course description
  - `duration_hours` (integer) - Course duration in hours
  - `is_public` (boolean) - Whether course is available for purchase
  - `price` (decimal) - Course price if public
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `course_ownership`
  - `id` (uuid, primary key) - Unique ownership record
  - `course_id` (uuid, foreign key) - References courses
  - `company_id` (uuid, foreign key) - Company that owns access to course
  - `purchased_at` (timestamptz) - When course was purchased/acquired

  ### `enrollments`
  - `id` (uuid, primary key) - Unique enrollment record
  - `course_id` (uuid, foreign key) - References courses
  - `group_id` (uuid, foreign key) - References groups
  - `enrolled_at` (timestamptz) - Enrollment timestamp
  - `status` (text) - Enrollment status (active, completed, cancelled)

  ## 2. Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Companies can only access their own data
  - Employees can only see data from their company
  - Course visibility follows ownership and public status rules

  ### RLS Policies

  #### Companies Table
  - SELECT: Companies can view their own profile
  - INSERT: Public registration allowed
  - UPDATE: Companies can update their own profile
  - DELETE: Companies can delete their own account

  #### Employees Table
  - SELECT: Company can view their employees
  - INSERT: Company can add employees
  - UPDATE: Company can update their employees
  - DELETE: Company can remove employees

  #### Groups Table
  - SELECT: Company can view their groups
  - INSERT: Company can create groups
  - UPDATE: Company can update their groups
  - DELETE: Company can delete their groups

  #### Group Members Table
  - SELECT: Company can view members of their groups
  - INSERT: Company can add members to their groups
  - UPDATE: Company can update group memberships
  - DELETE: Company can remove members from their groups

  #### Courses Table
  - SELECT: All authenticated users can view public courses, companies can view their own courses
  - INSERT: Authenticated companies can create courses
  - UPDATE: Course owner can update their courses
  - DELETE: Course owner can delete their courses

  #### Course Ownership Table
  - SELECT: Companies can view courses they own
  - INSERT: System handles course ownership grants
  - DELETE: System handles ownership removal

  #### Enrollments Table
  - SELECT: Companies can view enrollments for their groups
  - INSERT: Companies can enroll their groups in courses they own
  - UPDATE: Companies can update enrollment status
  - DELETE: Companies can cancel enrollments

  ## 3. Indexes
  - Foreign key indexes for performance
  - Email indexes for faster lookups
  - Composite indexes for common queries

  ## 4. Important Notes
  - All timestamps use timestamptz for timezone awareness
  - UUIDs are generated using gen_random_uuid()
  - Passwords must be hashed before storage (handled by application)
  - Price uses numeric(10,2) for precise decimal handling
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, email)
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  UNIQUE(group_id, employee_id)
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  duration_hours integer DEFAULT 0,
  is_public boolean DEFAULT false,
  price numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_ownership table
CREATE TABLE IF NOT EXISTS course_ownership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(course_id, company_id)
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  UNIQUE(course_id, group_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_groups_company_id ON groups(company_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_employee_id ON group_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_courses_owner_company_id ON courses(owner_company_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_public ON courses(is_public);
CREATE INDEX IF NOT EXISTS idx_course_ownership_course_id ON course_ownership(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ownership_company_id ON course_ownership(company_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_group_id ON enrollments(group_id);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies table
CREATE POLICY "Companies can view own profile"
  ON companies FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Public registration allowed"
  ON companies FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Companies can update own profile"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Companies can delete own account"
  ON companies FOR DELETE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- RLS Policies for employees table
CREATE POLICY "Companies can view their employees"
  ON employees FOR SELECT
  TO authenticated
  USING (auth.uid()::text = company_id::text);

CREATE POLICY "Companies can add employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = company_id::text);

CREATE POLICY "Companies can update their employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = company_id::text)
  WITH CHECK (auth.uid()::text = company_id::text);

CREATE POLICY "Companies can remove employees"
  ON employees FOR DELETE
  TO authenticated
  USING (auth.uid()::text = company_id::text);

-- RLS Policies for groups table
CREATE POLICY "Companies can view their groups"
  ON groups FOR SELECT
  TO authenticated
  USING (auth.uid()::text = company_id::text);

CREATE POLICY "Companies can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = company_id::text);

CREATE POLICY "Companies can update their groups"
  ON groups FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = company_id::text)
  WITH CHECK (auth.uid()::text = company_id::text);

CREATE POLICY "Companies can delete their groups"
  ON groups FOR DELETE
  TO authenticated
  USING (auth.uid()::text = company_id::text);

-- RLS Policies for group_members table
CREATE POLICY "Companies can view members of their groups"
  ON group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  );

CREATE POLICY "Companies can add members to their groups"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  );

CREATE POLICY "Companies can update group memberships"
  ON group_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  );

CREATE POLICY "Companies can remove members from their groups"
  ON group_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  );

-- RLS Policies for courses table
CREATE POLICY "Users can view public courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Companies can view their own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (auth.uid()::text = owner_company_id::text);

CREATE POLICY "Companies can view courses they own access to"
  ON courses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_ownership
      WHERE course_ownership.course_id = courses.id
      AND auth.uid()::text = course_ownership.company_id::text
    )
  );

CREATE POLICY "Companies can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = owner_company_id::text);

CREATE POLICY "Course owner can update their courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = owner_company_id::text)
  WITH CHECK (auth.uid()::text = owner_company_id::text);

CREATE POLICY "Course owner can delete their courses"
  ON courses FOR DELETE
  TO authenticated
  USING (auth.uid()::text = owner_company_id::text);

-- RLS Policies for course_ownership table
CREATE POLICY "Companies can view courses they own"
  ON course_ownership FOR SELECT
  TO authenticated
  USING (auth.uid()::text = company_id::text);

CREATE POLICY "System can grant course ownership"
  ON course_ownership FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can remove course ownership"
  ON course_ownership FOR DELETE
  TO authenticated
  USING (auth.uid()::text = company_id::text);

-- RLS Policies for enrollments table
CREATE POLICY "Companies can view enrollments for their groups"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = enrollments.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  );

CREATE POLICY "Companies can enroll their groups"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = enrollments.group_id
      AND auth.uid()::text = groups.company_id::text
    )
    AND
    EXISTS (
      SELECT 1 FROM course_ownership
      WHERE course_ownership.course_id = enrollments.course_id
      AND auth.uid()::text = course_ownership.company_id::text
    )
  );

CREATE POLICY "Companies can update enrollment status"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = enrollments.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = enrollments.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  );

CREATE POLICY "Companies can cancel enrollments"
  ON enrollments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = enrollments.group_id
      AND auth.uid()::text = groups.company_id::text
    )
  );