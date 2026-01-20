export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_super_admin: boolean | null
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_super_admin?: boolean | null
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_super_admin?: boolean | null
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      driver_registrations: {
        Row: {
          admin_notes: string | null
          city: string
          created_at: string
          id: string
          message: string | null
          name: string
          phone: string
          status: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          admin_notes?: string | null
          city: string
          created_at?: string
          id?: string
          message?: string | null
          name: string
          phone: string
          status?: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          admin_notes?: string | null
          city?: string
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      flight_enquiries: {
        Row: {
          admin_notes: string | null
          arrival_city: string
          class: string
          created_at: string
          departure_city: string
          departure_date: string
          email: string
          id: string
          message: string | null
          name: string
          passengers: number
          phone: string
          quoted_price: number | null
          return_date: string | null
          status: string
          trip_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          arrival_city: string
          class?: string
          created_at?: string
          departure_city: string
          departure_date: string
          email: string
          id?: string
          message?: string | null
          name: string
          passengers?: number
          phone: string
          quoted_price?: number | null
          return_date?: string | null
          status?: string
          trip_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          arrival_city?: string
          class?: string
          created_at?: string
          departure_city?: string
          departure_date?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          passengers?: number
          phone?: string
          quoted_price?: number | null
          return_date?: string | null
          status?: string
          trip_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          is_taxi_slide: boolean
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          is_taxi_slide?: boolean
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          is_taxi_slide?: boolean
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      taxi_enquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          drop_location: string | null
          email: string
          estimated_distance: number | null
          estimated_price: number | null
          id: string
          message: string | null
          name: string
          passengers: number | null
          phone: string
          pickup_date: string
          pickup_location: string
          pickup_time: string | null
          quoted_price: number | null
          return_date: string | null
          status: string
          trip_type: string
          updated_at: string
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          drop_location?: string | null
          email: string
          estimated_distance?: number | null
          estimated_price?: number | null
          id?: string
          message?: string | null
          name: string
          passengers?: number | null
          phone: string
          pickup_date: string
          pickup_location: string
          pickup_time?: string | null
          quoted_price?: number | null
          return_date?: string | null
          status?: string
          trip_type?: string
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          drop_location?: string | null
          email?: string
          estimated_distance?: number | null
          estimated_price?: number | null
          id?: string
          message?: string | null
          name?: string
          passengers?: number | null
          phone?: string
          pickup_date?: string
          pickup_location?: string
          pickup_time?: string | null
          quoted_price?: number | null
          return_date?: string | null
          status?: string
          trip_type?: string
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxi_enquiries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "taxi_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_vehicles: {
        Row: {
          ac: boolean
          base_price_per_day: number
          base_price_per_km: number
          category: string
          created_at: string
          features: string[] | null
          fuel_type: string | null
          id: string
          image_url: string | null
          is_active: boolean
          luggage_capacity: number
          name: string
          seating_capacity: number
          updated_at: string
        }
        Insert: {
          ac?: boolean
          base_price_per_day?: number
          base_price_per_km?: number
          category?: string
          created_at?: string
          features?: string[] | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          luggage_capacity?: number
          name: string
          seating_capacity?: number
          updated_at?: string
        }
        Update: {
          ac?: boolean
          base_price_per_day?: number
          base_price_per_km?: number
          category?: string
          created_at?: string
          features?: string[] | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          luggage_capacity?: number
          name?: string
          seating_capacity?: number
          updated_at?: string
        }
        Relationships: []
      }
      tour_enquiries: {
        Row: {
          admin_notes: string | null
          adults: number | null
          children: number | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          quoted_price: number | null
          status: Database["public"]["Enums"]["enquiry_status"] | null
          tour_package_id: string | null
          travel_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          adults?: number | null
          children?: number | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          quoted_price?: number | null
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          tour_package_id?: string | null
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          adults?: number | null
          children?: number | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          quoted_price?: number | null
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          tour_package_id?: string | null
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_enquiries_tour_package_id_fkey"
            columns: ["tour_package_id"]
            isOneToOne: false
            referencedRelation: "tour_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_packages: {
        Row: {
          category: Database["public"]["Enums"]["tour_category"]
          country: string | null
          created_at: string
          description: string | null
          discounted_price: number | null
          duration_days: number
          duration_nights: number
          exclusions: string[] | null
          featured_image: string | null
          highlights: string[] | null
          hotel_details: Json | null
          id: string
          images: string[] | null
          inclusions: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          itinerary: Json | null
          location: string
          max_group_size: number | null
          meta_description: string | null
          meta_title: string | null
          min_group_size: number | null
          price_per_person: number
          rating: number | null
          slug: string
          state: string | null
          title: string
          total_reviews: number | null
          tour_type: Database["public"]["Enums"]["tour_type"]
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["tour_category"]
          country?: string | null
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          duration_days: number
          duration_nights: number
          exclusions?: string[] | null
          featured_image?: string | null
          highlights?: string[] | null
          hotel_details?: Json | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          location: string
          max_group_size?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_group_size?: number | null
          price_per_person: number
          rating?: number | null
          slug: string
          state?: string | null
          title: string
          total_reviews?: number | null
          tour_type?: Database["public"]["Enums"]["tour_type"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tour_category"]
          country?: string | null
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          duration_days?: number
          duration_nights?: number
          exclusions?: string[] | null
          featured_image?: string | null
          highlights?: string[] | null
          hotel_details?: Json | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          location?: string
          max_group_size?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_group_size?: number | null
          price_per_person?: number
          rating?: number | null
          slug?: string
          state?: string | null
          title?: string
          total_reviews?: number | null
          tour_type?: Database["public"]["Enums"]["tour_type"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      enquiry_status:
        | "pending"
        | "quoted"
        | "confirmed"
        | "completed"
        | "cancelled"
      tour_category:
        | "adventure"
        | "honeymoon"
        | "family"
        | "pilgrimage"
        | "wildlife"
        | "beach"
        | "hill_station"
        | "heritage"
      tour_type: "domestic" | "international"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      enquiry_status: [
        "pending",
        "quoted",
        "confirmed",
        "completed",
        "cancelled",
      ],
      tour_category: [
        "adventure",
        "honeymoon",
        "family",
        "pilgrimage",
        "wildlife",
        "beach",
        "hill_station",
        "heritage",
      ],
      tour_type: ["domestic", "international"],
    },
  },
} as const
