import express, { json } from "express";
import ejs from "ejs";
import fs from "fs";
import cron from "node-cron";
const port = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Create

app.post("/add", async (req, res) => {
  try {
    let allTasks = JSON.parse(fs.readFileSync("./db.json"));

    const newTask = {
      id: `TASK-${Math.ceil(Math.random() * 100000)}`,
      task: req.body.task,
      completed: false,
    };

    allTasks.push(newTask);

    const jsonString = JSON.stringify(allTasks);

    fs.writeFile("./db.json", jsonString, "utf-8", () => {
      return res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
});

// Read

app.get("/", (req, res) => {
  let jsonData = fs.readFileSync("./db.json");
  let data = JSON.parse(jsonData);

  return res.render("index", { allTasks: data });
});

// Update
// Delete

app.post("/delete/:id", (req, res) => {
  const allTasks = JSON.parse(fs.readFileSync("./db.json"));

  const filteredTasks = allTasks.filter((el) => el.id !== req.params.id);

  fs.writeFileSync("./db.json", JSON.stringify(filteredTasks));

  res.redirect("/");
});

// Setting Complete
app.post("/completed/:id", (req, res) => {
  const allTasks = JSON.parse(fs.readFileSync("./db.json"));

  const taskToSetComplete = allTasks.findIndex((el) => el.id === req.params.id);

  allTasks[taskToSetComplete].completed =
    !allTasks[taskToSetComplete].completed;

  fs.writeFileSync("./db.json", JSON.stringify(allTasks));

  res.redirect("/");
});

// Setting a corn job to delete completed tasks on 12:00 AM
cron.schedule("0 0 0 * * *", () => {
  try {
    const allTasks = JSON.parse(fs.readFileSync("./db.json"));
    const nonCompletedTasks = allTasks.filter((el) => !el.completed);
    fs.writeFileSync("./db.json", JSON.stringify(nonCompletedTasks));
    return console.log("All Completed Task Have Deleted");
  } catch (error) {
    console.log(error.message);
  }
});

// ------ Listening ------ //
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
