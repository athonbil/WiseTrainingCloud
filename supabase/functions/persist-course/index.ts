import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CourseData {
  owner_company_id: string;
  title: string;
  description?: string;
  duration_hours?: number;
  is_public?: boolean;
  price?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const courseData: CourseData = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert course into database
    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        owner_company_id: courseData.owner_company_id,
        title: courseData.title,
        description: courseData.description || '',
        duration_hours: courseData.duration_hours || 0,
        is_public: courseData.is_public || false,
        price: courseData.price || 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Automatically grant ownership to the creating company
    const { error: ownershipError } = await supabase
      .from("course_ownership")
      .insert({
        course_id: course.id,
        company_id: courseData.owner_company_id,
      });

    if (ownershipError) {
      console.error("Failed to create ownership record:", ownershipError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Course persisted successfully",
        course,
      }),
      {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});