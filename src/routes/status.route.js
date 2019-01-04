export const route = {
    route: 'status',
    get: function () {
        console.log("CALL status")
        return {path: ['status'], value: this.user ? 'authenticated' : 'unauthenticated'}
    }
}
