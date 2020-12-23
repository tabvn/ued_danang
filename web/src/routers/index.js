import shared from "./shared";
import admin from "./admin";
import student from "./student";
import teacher from "./teacher";

export default [
    ...shared,
    ...admin,
    ...student,
    ...teacher,
];
