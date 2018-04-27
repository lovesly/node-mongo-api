/* eslint-disable */
const users = [{
    id: 1,
    name: 'zz',
    schoolId: 101,
}, {
    id: 2,
    name: 'sly',
    schoolId: 202,
}];
const grades = [{
    id: 1,
    schoolId: 101,
    grade: 85,
}, {
    id: 2,
    schoolId: 202,
    grade: 86,
}, {
    id: 3,
    schoolId: 101,
    grade: 90,
}];

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const user = users.find(obj => obj.id === id);
        if (user) {
            resolve(user);
        } else {
            reject(`Unable to find user with id: ${id}`);
        }
    });
};

const getGrades = (schoolId) => {
    // no reject?
    return new Promise((resolve, reject) => {
        resolve(grades.filter(grade => grade.schoolId === schoolId));
    });
};

const getStatus = (userId) => {
    let user;
    return getUser(userId).then((_user) => {
        user = _user;
        return getGrades(user.schoolId);
    }).then((grades) => {
        let average = 0;
        if (grades.length) {
            average = grades.map(grade => grade.grade).reduce((a, b) => a + b)/grades.length;
        }
        console.log(average);
        return `${user.name} has a ${average} in the class.`;
    });
};
// getUser(10).then((user) => {
//     console.log(user);
// }).catch(e => console.log(e));

getGrades(999).then((grades) => {
    console.log(grades);
}).catch(e => console.log(e));

getStatus(4).then((status) => {
    console.log(status);
}).catch(e => console.log(e));
