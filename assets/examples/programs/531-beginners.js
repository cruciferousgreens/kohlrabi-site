// assets/examples/programs/531-beginners.js
// 5/3/1 for Beginners — program + its 3 workout(s).
// Just fill in the fields below. Detail pages are generated automatically —
// no HTML files needed. Add this file's path to ../manifest.js to include it.

exampleProgram(({
    id: "531-beginners",
    pageSlug: "531-for-beginners",
    title: "5/3/1 for Beginners",
    share: "https://kohlrabi.us/s/iScLcbRF",
    blurb: "Three full-body days a week — main lifts plus 5 × 5 first-set-last volume and 50–100 reps of push/pull/legs assistance.",
    schedule: "Three full-body days a week in 3-week cycles. Each day: one main lift done with 5/3/1 sets, a second lift for 5 × 5 at the first-set-last weight, then 50–100 total reps each of push, pull, and single-leg or core assistance.",
    progression: "Run each cycle, then add 5 lb to upper-body training maxes and 10 lb to lower-body training maxes and repeat. The percentages keep the weights submaximal so you rarely miss."
  }));

// --- Workout 1: 5/3/1 for Beginners — Monday (workouts/531-beginners-monday.html) ---
exampleWorkout(({
    program: "531-beginners",
    title: "5/3/1 for Beginners — Monday",
    slug: "531-beginners-monday",
    share: "https://kohlrabi.us/s/f8ew4wDl",
    desc: "Main lifts, first-set-last volume, and simple push/pull assistance.",
    tags: "strength full-body",
    tagLabel: "Strength",
    exercises: [
      ["Squat", "5/3/1"],
      ["Bench press", "5 × 5 FSL"],
      ["Assistance (push/pull/single-leg or core)", "50–100 reps"]
    ],
    attr: "Adapted from the r/Fitness wiki’s <a href=\"https://thefitness.wiki/routines/\" target=\"_blank\" rel=\"noopener\">5/3/1 for Beginners template</a>, based on <a href=\"https://www.jimwendler.com/blogs/jimwendler-com/5-3-1-for-beginners\" target=\"_blank\" rel=\"noopener\">Jim Wendler’s program</a>."
  }));

// --- Workout 2: 5/3/1 for Beginners — Wednesday (workouts/531-beginners-wednesday.html) ---
exampleWorkout(({
    program: "531-beginners",
    title: "5/3/1 for Beginners — Wednesday",
    slug: "531-beginners-wednesday",
    share: "https://kohlrabi.us/s/wtBvdoZr",
    desc: "Deadlift 5/3/1, overhead press 5 × 5 at the first-set-last weight, and simple push/pull assistance.",
    tags: "strength full-body",
    tagLabel: "Strength",
    exercises: [
      ["Deadlift", "5/3/1"],
      ["Overhead press", "5 × 5 FSL"],
      ["Assistance (push/pull/single-leg or core)", "50–100 reps"]
    ],
    attr: "Adapted from the r/Fitness wiki’s <a href=\"https://thefitness.wiki/routines/\" target=\"_blank\" rel=\"noopener\">5/3/1 for Beginners template</a>, based on <a href=\"https://www.jimwendler.com/blogs/jimwendler-com/5-3-1-for-beginners\" target=\"_blank\" rel=\"noopener\">Jim Wendler’s program</a>."
  }));

// --- Workout 3: 5/3/1 for Beginners — Friday (workouts/531-beginners-friday.html) ---
exampleWorkout(({
    program: "531-beginners",
    title: "5/3/1 for Beginners — Friday",
    slug: "531-beginners-friday",
    share: "https://kohlrabi.us/s/fHp6fZMG",
    desc: "Bench press 5/3/1, squat 5 × 5 at the first-set-last weight, and simple push/pull assistance.",
    tags: "strength full-body",
    tagLabel: "Strength",
    exercises: [
      ["Bench press", "5/3/1"],
      ["Squat", "5 × 5 FSL"],
      ["Assistance (push/pull/single-leg or core)", "50–100 reps"]
    ],
    attr: "Adapted from the r/Fitness wiki’s <a href=\"https://thefitness.wiki/routines/\" target=\"_blank\" rel=\"noopener\">5/3/1 for Beginners template</a>, based on <a href=\"https://www.jimwendler.com/blogs/jimwendler-com/5-3-1-for-beginners\" target=\"_blank\" rel=\"noopener\">Jim Wendler’s program</a>."
  }));
