//definir el usuario

export interface User {
    readonly id: string;
    readonly fullname: string;
    readonly email: string;
    readonly role: "ADMIN" | "TECHNICIAN" | "PRODUCER" | "VIEWER";
    readonly createdAt: string;
}
