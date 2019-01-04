export const errorStore = {
    notAuthed: () => new Error("not authorized"),
    notFound: () => new Error("not found"),
}