-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('LEVEL');

-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('CONFIRM_EMAIL', 'ACTIVATE_ACCOUNT', 'RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(25) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "password" TEXT,
    "need_reset_password" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "image" VARCHAR(1000) NOT NULL DEFAULT '',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "TokenType" NOT NULL,
    "token" TEXT NOT NULL,
    "token_hash" VARCHAR(320),
    "expires_at" TIMESTAMP(3),
    "user_id" VARCHAR(25),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(30) NOT NULL,
    "contact_email" VARCHAR(255),
    "contact_name" VARCHAR(128),
    "default_language" CHAR(3) NOT NULL,
    "current_maintenance_window" VARCHAR(128),
    "maintenance_window" VARCHAR(128),

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "identifier" VARCHAR(255),
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "other_name" VARCHAR(255),
    "birth_date" DATE NOT NULL,
    "properties" JSONB NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "type" "PropertyType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(25),

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_levels" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),
    "color" CHAR(7) NOT NULL,

    CONSTRAINT "class_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_branches" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),
    "color" CHAR(7) NOT NULL,

    CONSTRAINT "class_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),
    "main_teacher_id" INTEGER,
    "level_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imports" (
    "id" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ImportStatus" NOT NULL,
    "data" JSONB,

    CONSTRAINT "imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_students" (
    "id" SERIAL NOT NULL,
    "import_id" VARCHAR(25) NOT NULL,
    "student_id" INTEGER,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "other_name" VARCHAR(255),
    "birth_date" DATE NOT NULL,

    CONSTRAINT "import_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_classes" (
    "id" SERIAL NOT NULL,
    "import_id" VARCHAR(25) NOT NULL,
    "class_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "level_id" INTEGER NOT NULL,

    CONSTRAINT "import_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_class_levels" (
    "id" SERIAL NOT NULL,
    "import_id" VARCHAR(25) NOT NULL,
    "class_level_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "import_class_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_branch_to_level" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_class_to_teacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_class_to_student" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_branch_to_class" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_class_to_room" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ImportClassToImportStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "tokens_user_id_idx" ON "tokens"("user_id");

-- CreateIndex
CREATE INDEX "tokens_token_hash_idx" ON "tokens"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_type_token_key" ON "tokens"("type", "token");

-- CreateIndex
CREATE UNIQUE INDEX "students_identifier_key" ON "students"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "properties_name_key" ON "properties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_name_key" ON "academic_years"("name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_main_teacher_id_key" ON "classes"("main_teacher_id");

-- CreateIndex
CREATE INDEX "classes_academic_year_id_level_id_idx" ON "classes"("academic_year_id", "level_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "import_students_import_id_student_id_key" ON "import_students"("import_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "import_classes_import_id_class_id_key" ON "import_classes"("import_id", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "import_class_levels_import_id_class_level_id_key" ON "import_class_levels"("import_id", "class_level_id");

-- CreateIndex
CREATE UNIQUE INDEX "_branch_to_level_AB_unique" ON "_branch_to_level"("A", "B");

-- CreateIndex
CREATE INDEX "_branch_to_level_B_index" ON "_branch_to_level"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_class_to_teacher_AB_unique" ON "_class_to_teacher"("A", "B");

-- CreateIndex
CREATE INDEX "_class_to_teacher_B_index" ON "_class_to_teacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_class_to_student_AB_unique" ON "_class_to_student"("A", "B");

-- CreateIndex
CREATE INDEX "_class_to_student_B_index" ON "_class_to_student"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_branch_to_class_AB_unique" ON "_branch_to_class"("A", "B");

-- CreateIndex
CREATE INDEX "_branch_to_class_B_index" ON "_branch_to_class"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_class_to_room_AB_unique" ON "_class_to_room"("A", "B");

-- CreateIndex
CREATE INDEX "_class_to_room_B_index" ON "_class_to_room"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ImportClassToImportStudent_AB_unique" ON "_ImportClassToImportStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ImportClassToImportStudent_B_index" ON "_ImportClassToImportStudent"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_main_teacher_id_fkey" FOREIGN KEY ("main_teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_students" ADD CONSTRAINT "import_students_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_students" ADD CONSTRAINT "import_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_classes" ADD CONSTRAINT "import_classes_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_classes" ADD CONSTRAINT "import_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_classes" ADD CONSTRAINT "import_classes_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "import_class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_class_levels" ADD CONSTRAINT "import_class_levels_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_class_levels" ADD CONSTRAINT "import_class_levels_class_level_id_fkey" FOREIGN KEY ("class_level_id") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branch_to_level" ADD CONSTRAINT "_branch_to_level_A_fkey" FOREIGN KEY ("A") REFERENCES "class_branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branch_to_level" ADD CONSTRAINT "_branch_to_level_B_fkey" FOREIGN KEY ("B") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_to_teacher" ADD CONSTRAINT "_class_to_teacher_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_to_teacher" ADD CONSTRAINT "_class_to_teacher_B_fkey" FOREIGN KEY ("B") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_to_student" ADD CONSTRAINT "_class_to_student_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_to_student" ADD CONSTRAINT "_class_to_student_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branch_to_class" ADD CONSTRAINT "_branch_to_class_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branch_to_class" ADD CONSTRAINT "_branch_to_class_B_fkey" FOREIGN KEY ("B") REFERENCES "class_branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_to_room" ADD CONSTRAINT "_class_to_room_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_to_room" ADD CONSTRAINT "_class_to_room_B_fkey" FOREIGN KEY ("B") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImportClassToImportStudent" ADD CONSTRAINT "_ImportClassToImportStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "import_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImportClassToImportStudent" ADD CONSTRAINT "_ImportClassToImportStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "import_students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
