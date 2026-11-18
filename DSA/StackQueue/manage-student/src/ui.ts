import { students, type Student, type Gender } from "./students.js";

type SeedStudent = { name: string; age: number; gender: "male" | "female" };

class GetUIElement {
  constructor(public id: string) {}

  getElement(): HTMLElement {
    const element = document.getElementById(this.id);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`element id (${this.id}) not found`);
    }

    return element;
  }

  getInput(): HTMLInputElement {
    const input = document.getElementById(this.id);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error(`input element id (${this.id}) not found`);
    }

    return input;
  }

  getForm(): HTMLFormElement {
    const form = document.getElementById(this.id);
    if (!(form instanceof HTMLFormElement)) {
      throw new Error(`form element id (${this.id}) not found`);
    }

    return form;
  }
}

class SeedData {
  private seedStudents: SeedStudent[] = [
    { name: "Nguyen Van An", age: 20, gender: "male" },
    { name: "Tran Thi Binh", age: 19, gender: "female" },
    { name: "Le Minh Cuong", age: 21, gender: "male" },
    { name: "Pham Thu Dung", age: 22, gender: "female" },
    { name: "Hoang Gia Huy", age: 18, gender: "male" },
  ];

  load(): void {
    for (const s of this.seedStudents) {
      students.createPendingStudent(s.name, s.age, s.gender);
      students.approvedPendingStudent();
    }
  }
}

class DisplayData {
  renderStudent(students: Student[]): void {
    const tBodyEle = new GetUIElement("student-body").getElement();
    tBodyEle.replaceChildren();
    const emptyMsgEle = new GetUIElement("empty-state").getElement();

    if (students.length === 0) {
      emptyMsgEle.hidden = false;
    } else {
      emptyMsgEle.hidden = true;

      for (const s of students) {
        const tRow = document.createElement("tr");
        const tDataId = document.createElement("td");
        const tDataName = document.createElement("td");
        const tDataAge = document.createElement("td");
        const tDataGender = document.createElement("td");
        const tDataAction = document.createElement("td");
        const deleteBtn = document.createElement("button");

        tDataId.textContent = s.id;
        tDataName.textContent = s.name;
        tDataAge.textContent = String(s.age);
        tDataGender.textContent = s.gender;

        deleteBtn.textContent = "Delete";
        deleteBtn.dataset["id"] = s.id;

        tDataAction.append(deleteBtn);
        tRow.append(tDataId, tDataName, tDataAge, tDataGender, tDataAction);
        tBodyEle.append(tRow);
      }
    }
  }

  refresh(): void {
    const emptyMsgEle = new GetUIElement("empty-state").getElement();
    const queryName = new GetUIElement("name-search-input").getInput();
    const errorMsg = new GetUIElement("message").getElement();

    const name = queryName.value.trim().toLowerCase();
    errorMsg.textContent = "";

    let studentsList: Student[] = [];

    if (name === "") {
      studentsList = students.getStudentsList();
    } else {
      try {
        const found = students.getStudentsByName(name);
        if (found.length === 0) {
          emptyMsgEle.hidden = false;
        } else {
          emptyMsgEle.hidden = true;
        }
        studentsList = found;
      } catch (error) {
        if (error instanceof Error) {
          errorMsg.textContent = error.message;
        }
      }
    }

    this.renderStudent(studentsList);
  }
}

class ProcessStudent {
  handleAddSubmitToQueue(event: SubmitEvent): void {
    event.preventDefault();

    const errorMsg = new GetUIElement("message").getElement();
    const addFrm = new GetUIElement("add-form").getForm();
    const nameInp = new GetUIElement("name-input").getInput();
    const ageInp = new GetUIElement("age-input").getInput();
    const femaleInp = new GetUIElement("female").getInput();

    const name = nameInp.value.trim();
    const age = ageInp.value.trim();
    const gender: Gender = femaleInp.checked ? "female" : "male";

    if (name === "" || age === "") {
      errorMsg.textContent = "name and age must not be empty";
      return;
    }

    try {
      students.createPendingStudent(name, Number(age), gender);
      addFrm.reset();
      errorMsg.textContent = `${name} is added to approve queue`;
    } catch (error) {
      if (error instanceof Error) {
        errorMsg.textContent = error.message;
      }
    }
  }

  handleClickApproved(): void {
    const errorMsg = new GetUIElement("message").getElement();

    try {
      const newStudent = students.approvedPendingStudent();
      new DisplayData().refresh();
      errorMsg.textContent = `${newStudent.name} is approved to list`;
    } catch (error) {
      if (error instanceof Error) {
        errorMsg.textContent = error.message;
      }
    }
  }
}

class ProcessDeletion {
  handleClickDelete(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const tBodyEle = new GetUIElement("student-body").getElement();
    const errorMsg = new GetUIElement("message").getElement();

    const deleteBtn =
      event.target.closest<HTMLButtonElement>("button[data-id]");
    if (!deleteBtn || !tBodyEle.contains(deleteBtn)) return;

    const id = deleteBtn.dataset.id;
    if (!id) return;

    if (window.confirm("Delete this student?")) {
      try {
        const deletedStudent = students.deleteStudentById(id);
        new DisplayData().refresh();
        errorMsg.textContent = `${deletedStudent.name} is moved from list to deletion stack`;
      } catch (error) {
        if (error instanceof Error) {
          errorMsg.textContent = error.message;
        }
      }
    }
  }

  undoDeletion(): void {
    const errorMsg = new GetUIElement("message").getElement();
    try {
      const undoStudent = students.undoDeletion();
      new DisplayData().refresh();
      errorMsg.textContent = `${undoStudent.name} is added back to the list`;
    } catch (error) {
      if (error instanceof Error) {
        errorMsg.textContent = error.message;
      }
    }
  }
}

const display = new DisplayData();

const addFrm = new GetUIElement("add-form").getForm();
addFrm.addEventListener("submit", new ProcessStudent().handleAddSubmitToQueue);

const approveBtn = new GetUIElement("approve-btn").getElement();
approveBtn.addEventListener("click", new ProcessStudent().handleClickApproved);

const studentTBody = new GetUIElement("student-body").getElement();
studentTBody.addEventListener("click", new ProcessDeletion().handleClickDelete);

const undoDelBtn = new GetUIElement("undo-btn").getElement();
undoDelBtn.addEventListener("click", new ProcessDeletion().undoDeletion);

const nameSearchInp = new GetUIElement("name-search-input").getInput();
nameSearchInp.addEventListener("input", () => display.refresh());

const clearSearchBtn = new GetUIElement("clear-search-btn").getElement();
clearSearchBtn.addEventListener("click", () => {
  nameSearchInp.value = "";
  display.refresh();
});

new SeedData().load();
display.refresh();
