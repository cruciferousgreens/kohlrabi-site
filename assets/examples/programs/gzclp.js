// assets/examples/programs/gzclp.js
// GZCLP - program + its 2 workout(s).
// Just fill in the fields below. Detail pages are generated automatically -
// no HTML files needed. Add this file's path to ../manifest.js to include it.

exampleProgram(({
    id: "gzclp",
    pageSlug: "gzclp",
    title: "GZCLP",
    share: "https://kohlrabi.us/s/1BsXjtvK",
    blurb: "Two full-body days: one heavy T1 lift, one volume T2 lift, and high-rep T3 accessories.",
    schedule: "Two full-body days a week. Every day has one heavy Tier 1 lift (5 × 3+), one Tier 2 volume lift (3 × 10), and Tier 3 accessories (3 × 15+). Squat leads Day 1 and overhead press leads Day 2.",
    progression: "Add 5-10 lb to T1 and T2 lifts each session while you hit your reps; add weight to T3 accessories when the last set hits 25+ reps. Miss reps, and the tier drops to a new rep scheme at a slightly lower weight."
  }));

// --- Workout 1: GZCLP - Day 1 (workouts/gzclp-day-1.html) ---
exampleWorkout(({
    program: "gzclp",
    title: "GZCLP - Day 1",
    slug: "gzclp-day-1",
    share: "https://kohlrabi.us/s/F4DMkp9e",
    desc: "One heavy lift, one volume lift, and accessories.",
    tags: "strength beginner full-body",
    tagLabel: "Strength",
    exercises: [
      ["Squat (T1)", "5 × 3+"],
      ["Bench press (T2)", "3 × 10"],
      ["Lat pulldown (T3)", "3 × 15+"]
    ],
    attr: "Adapted from <a href=\"https://swoleateveryheight.blogspot.com/2016/02/gzclp-applications-adaptations.html\" target=\"_blank\" rel=\"noopener\">GZCLP by Cody LeFever</a>."
  }));

// --- Workout 2: GZCLP - Day 2 (workouts/gzclp-day-2.html) ---
exampleWorkout(({
    program: "gzclp",
    title: "GZCLP - Day 2",
    slug: "gzclp-day-2",
    share: "https://kohlrabi.us/s/ieErwaMI",
    desc: "Press heavy, pull for volume, row for balance.",
    tags: "strength full-body",
    tagLabel: "Strength",
    exercises: [
      ["Overhead press (T1)", "5 × 3+"],
      ["Deadlift (T2)", "3 × 10"],
      ["Dumbbell row (T3)", "3 × 15+"]
    ],
    attr: "Adapted from <a href=\"https://swoleateveryheight.blogspot.com/2016/02/gzclp-applications-adaptations.html\" target=\"_blank\" rel=\"noopener\">GZCLP by Cody LeFever</a>."
  }));
