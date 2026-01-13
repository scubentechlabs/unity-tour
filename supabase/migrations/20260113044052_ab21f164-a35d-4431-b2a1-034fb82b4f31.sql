-- Drop existing restrictive SELECT policies
DROP POLICY IF EXISTS "Admins can view all taxi enquiries" ON taxi_enquiries;
DROP POLICY IF EXISTS "Users can view their own taxi enquiries" ON taxi_enquiries;

-- Create PERMISSIVE policies (default) so admins OR users can view
CREATE POLICY "Admins can view all taxi enquiries" 
ON taxi_enquiries 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own taxi enquiries" 
ON taxi_enquiries 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);