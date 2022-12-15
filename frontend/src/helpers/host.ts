let HOST = 'https://fall2022-comp307-group7.cs.mcgill.ca';

if (process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    HOST = 'http://localhost:3000';
}

/**
 * @param {string} path The path to append to the host, MUST start with a forward slash, e.g. '/api/users'
 * @returns {string} The fully qualified URL based on dev/prod, e.g. 'https://fall2022-comp307-group7.cs.mcgill.ca/api/users'
 */
const getFullyQualifiedUrl = (path: string) => {
    if (!path.startsWith('/'))
        throw new Error('Relative path must start with a forward slash. Got ' + path + ' instead.');
    return `${HOST}${path}`;
};

export default getFullyQualifiedUrl;
