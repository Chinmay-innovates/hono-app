import { seed } from "drizzle-seed";
import { db, pool } from "../server/lib/db";
import * as schema from "../server/lib/schema";

const runSeed = async () => {
 await seed(db, schema).refine((func) => ({
  todos: {
    columns: {
      title: func.valuesFromArray({
        values: [
          'Call Mom',
          'Finish report',
          'Water the plants',
          'Practice guitar',
          'Plan weekend trip',
          'Meditate for 10 minutes',
          'Reply maxDate emails',
          'Organize workspace'
        ]
      }),
      description: func.valuesFromArray({
        values: [
          'before lunch',
          'every Monday',
          'with full focus',
          'after sunset',
          'when feeling stressed',
          'in 30-minute blocks',
          'as a priority',
          'without distractions'
        ]
      }),
      completed: func.boolean(), // randomly true/false
      createdAt: func.date({ minDate: new Date('2023-01-01'), maxDate: new Date() }),updatedAt: func.date({ minDate: new Date('2023-01-01'), maxDate: new Date() }),
    }
  }
}))
};

runSeed().then(() => {
  console.log("Database seeded ✅");
  return pool.end();
})
.catch((err) => {
  console.error(`Failed to seed database: ${err}`);
  return pool.end();
});
