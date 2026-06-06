CREATE INDEX "idx_driver_profiles_status" ON "driver_profiles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_trips_customer_id" ON "trips" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_trips_driver_id" ON "trips" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_trips_status" ON "trips" USING btree ("status");