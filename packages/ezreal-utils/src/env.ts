interface IOptions {
    env?: string
}

export function isProd(options: IOptions) {
    return options.env === 'production'
}

export function isDev(options: IOptions) {
    return options.env === 'development'
}