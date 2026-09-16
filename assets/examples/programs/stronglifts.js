// assets/examples/programs/stronglifts.js
// StrongLifts 5×5 - program + its 2 workout(s).
// Just fill in the fields below. Detail pages are generated automatically -
// no HTML files needed. Add this file's path to ../manifest.js to include it.

exampleProgram(({
    id: "stronglifts",
    pageSlug: "stronglifts-5x5",
    title: "StrongLifts 5×5",
    share: "https://kohlrabi.us/s/5PN8WOqE",
    blurb: "Two alternating workouts, three days a week, 5 × 5 across, +5 lb every session.",
    schedule: "Alternate Workout A and Workout B across three nonconsecutive days a week. Every lift is 5 sets of 5 - except the deadlift, which is one heavy set of 5 in Workout B.",
    progression: "Add 5 lb to each lift every workout (2.5 lb works for the press once it gets heavy). Stall three sessions in a row and deload 10%, then climb back up."
  }));

// --- Workout 1: StrongLifts 5×5 - Workout A (workouts/stronglifts-5x5-a.html) ---
exampleWorkout(({
    program: "stronglifts",
    title: "StrongLifts 5×5 - Workout A",
    slug: "stronglifts-5x5-a",
    share: "https://kohlrabi.us/s/tQwz7L1B",
    desc: "Squat, bench press, and barbell row. Five sets of five.",
    tags: "strength beginner",
    tagLabel: "Strength",
    exercises: [
      ["Squat", "5 × 5"],
      ["Bench press", "5 × 5"],
      ["Barbell row", "5 × 5"]
    ],
    attr: "Adapted from <a href=\"https://stronglifts.com/stronglifts-5x5/workout-program/\" target=\"_blank\" rel=\"noopener\">StrongLifts 5×5</a>."
  }));

// --- Workout 2: StrongLifts 5×5 - Workout B (workouts/stronglifts-5x5-b.html) ---
exampleWorkout(({
    program: "stronglifts",
    title: "StrongLifts 5×5 - Workout B",
    slug: "stronglifts-5x5-b",
    share: "https://kohlrabi.us/s/kefp0MFN",
    desc: "Squat, overhead press, and one heavy set of deadlifts. Five sets of five.",
    tags: "strength beginner",
    tagLabel: "Strength",
    exercises: [
      ["Squat", "5 × 5"],
      ["Overhead press", "5 × 5"],
      ["Deadlift", "1 × 5"]
    ],
    attr: "Adapted from <a href=\"https://stronglifts.com/stronglifts-5x5/workout-program/\" target=\"_blank\" rel=\"noopener\">StrongLifts 5×5</a>."
  }));
