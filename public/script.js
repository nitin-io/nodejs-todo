console.log("This is a client side script");

const deleteBtn = document.getElementsByClassName("delete-btn");
const updateBtn = document.getElementsByClassName("update-btn");
const completeBtn = document.getElementsByClassName("complete-btn");

Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", async (e) => {
    await fetch(`/delete/${e.target.value}`, { method: "POST" });
    location.reload();
  });
});

Array.from(updateBtn).forEach((element) => {
  element.addEventListener("click", async (e) => {
    const updatedTodo = prompt("Update todo: ", e.target.value);
    const formData = new FormData();
    formData.append("todo", updatedTodo);
    console.log(formData);

    await fetch(`/update/${e.target.id}`, {
      method: "POST",
      body: { updatedTodo },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return location.reload();
  });
});

Array.from(completeBtn).forEach((el) => {
  el.addEventListener("click", (e) => {
    fetch(`/completed/${e.target.value}`, { method: "POST" });
  });
});
