export const route = {
    route: 'status',
    get: function () {
        return {path: ['status'], value: this.user ? 'authenticated' : 'unauthenticated'}
    }
}
