export interface Student {
  id: string;
  name: string;
  age: number;
  gender: Gender;
}

export type Gender = "male" | "female";

class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  toArray(): T[] {
    return [...this.items];
  }
}

class Stack<T> {
  private items: T[] = [];

  pushItem(item: T): void {
    this.items.push(item);
  }

  popItem(): T | undefined {
    return this.items.pop();
  }

  toArray(): T[] {
    return [...this.items];
  }
}

class StudentService {
  private static idCounter: number = 0;
  private students = new Map<string, Student>();
  private approvedStudentsQueue = new Queue<Student>();
  private deletedStudentsStack = new Stack<Student>();

  createPendingStudent(name: string, age: number, gender: Gender): void {
    if (!isValidNumber(age, 1, 100, true)) {
      throw new Error("age must be a positive integer");
    }
    const student: Student = {
      id: this.calculateNextId(),
      name,
      age,
      gender,
    };
    this.approvedStudentsQueue.enqueue(student);
  }

  calculateNextId(): string {
    return "S" + String(++StudentService.idCounter).padStart(3, "0");
  }

  approvedPendingStudent(): Student {
    const newStudent = this.approvedStudentsQueue.dequeue();
    if (!newStudent) {
      throw new Error("no student in the wait queue");
    }
    this.students.set(newStudent.id, newStudent);
    return newStudent;
  }

  getStudentsList(): Student[] {
    return [...this.students.values()];
  }

  private findStudentById(id: string): Student {
    const normalizedId = id.trim().toUpperCase();
    if (normalizedId === "") {
      throw new Error("id must not be empty");
    }
    const found = this.students.get(id);
    if (!found) {
      throw new Error(`can not student with id (${id})`);
    }
    return found;
  }

  getStudentsByName(query: string): Student[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === "") {
      throw new Error("query must not be empty");
    }
    const studentsArrClone = this.getStudentsList();
    const foundStudents = studentsArrClone.filter((s) =>
      s.name.toLowerCase().includes(normalizedQuery),
    );
    if (foundStudents.length === 0) {
      throw new Error(`can not find any student with name (${query})`);
    }
    return foundStudents;
  }

  deleteStudentById(id: string): Student {
    const found = this.findStudentById(id);
    this.students.delete(found.id);
    this.deletedStudentsStack.pushItem(found);
    return found;
  }

  undoDeletion(): Student {
    const student = this.deletedStudentsStack.popItem();
    if (!student) {
      throw new Error("no student in the delete stack");
    }
    this.students.set(student.id, student);
    return student;
  }
}

// --------------------------- HELPERS ---------------------------
function isValidNumber(
  n: number,
  min: number,
  max: number,
  integer: boolean = false,
): boolean {
  const valid = n >= min && n <= max && (!integer || Number.isInteger(n));
  return valid;
}

export const students = new StudentService();
