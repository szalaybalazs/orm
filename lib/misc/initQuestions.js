"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initQuestions = void 0;
exports.initQuestions = [
    {
        type: 'input',
        name: 'entities',
        default: './database/entities',
        message: 'Where do you want to keep your entities?',
    },
    {
        type: 'input',
        name: 'migrations',
        message: 'And your migrations?',
        default: './database/migrations/',
    },
    {
        type: 'input',
        name: 'snapshots',
        message: 'What about the snapshots?',
        default: './.orm/snapshots/',
    },
    {
        type: 'confirm',
        name: 'generate_types',
        message: 'Do you want to generate the types automatically?',
        default: true,
    },
    {
        type: 'input',
        name: 'types',
        message: 'Where should they be saved?',
        default: './database/types/',
        when: function (args) { return args.generate_types; },
    },
    {
        type: 'confirm',
        name: 'connection',
        message: 'Set up connection',
        default: true,
    },
    {
        type: 'input',
        name: 'database',
        message: 'Name of the database',
        when: function (args) { return args.connection; },
        default: 'database',
    },
    {
        type: 'input',
        name: 'host',
        message: 'Host the database is running on',
        default: 'localhost',
        when: function (args) { return args.connection; },
    },
    {
        type: 'input',
        name: 'port',
        message: 'Port of the database',
        default: 5432,
        when: function (args) { return args.connection; },
    },
    {
        type: 'input',
        name: 'user',
        message: 'Postgres username',
        when: function (args) { return args.connection; },
        default: 'user',
    },
    {
        type: 'password',
        name: 'password',
        message: 'Password of the user',
        when: function (args) { return args.connection; },
        mask: true,
    },
    {
        type: 'confirm',
        name: 'use_template',
        message: 'Do you want to use a template?',
        default: false,
    },
    {
        type: 'list',
        name: 'template',
        message: 'Which one?',
        when: function (args) { return args.use_template; },
        choices: [
            { label: 'Users', value: 'USERS' },
            { label: 'Departments & Employees', value: 'DEPARTMENTS' },
            { label: 'Blank', value: 'EMPTY' },
        ],
    },
];
