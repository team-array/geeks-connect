const graphql = require("graphql");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
    userResolver,
    userCreateResolver,
    editUserResolver,
    editUserBioResolver,
    editUserLocationResolver,
    userAuthCheck,
} = require("./userResolver");

const { profilePicUploadResolver } = require("./fileuploadResolver");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        tokens: {
            type: new GraphQLList(GraphQLString),
            resolve(parent, args) {
                // console.log("parent: ", parent.tokens);
                return parent.tokens.map((token) => token.token);
            },
        },
        role: { type: GraphQLString },
        rollNumber: { type: GraphQLString },
        college: { type: GraphQLString },
        location: { type: GraphQLString },
        hometown: { type: GraphQLString },
        bio: { type: GraphQLString },
        profilePic: { type: GraphQLString },
        backgroundPic: { type: GraphQLString },
        birthDate: { type: GraphQLString },
        secondarySchool: { type: GraphQLString },
        primarySchool: { type: GraphQLString },
    }),
});

const AuthType = new GraphQLObjectType({
    name: "Auth",
    fields: () => ({
        token: { type: GraphQLString },
        result: { type: GraphQLString },
    }),
});

const authCheckType = new GraphQLObjectType({
    name: "AuthCheck",
    fields: () => ({
        result: { type: GraphQLString },
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        role: { type: GraphQLString }
    }),
});

const FileType = new GraphQLObjectType({
    name: "File",
    fields: () => ({
        filename: { type: GraphQLString },
        mimetype: { type: GraphQLString },
        encoding: { type: GraphQLString },
    }),
});

const RootQuery = new graphql.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: graphql.GraphQLString } },
            resolve(parent, args) {
                return User.findById(args.id);
            },
        },
        auth: {
            type: AuthType,
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                college: { type: GraphQLString },
            },
            resolve(parent, args) {
                return userResolver(args);
            },
        },
        authCheck: {
            type: authCheckType,
            args: {
                token: { type: GraphQLString },
            },
            resolve(parent, args) {
                console.log("Hellp");
                return userAuthCheck(args);
            },
        },
    },
});

const Mutation = new graphql.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: AuthType,
            args: {
                username: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                email: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                password: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                role: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                rollNumber: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                college: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
            },
            resolve(parent, args) {
                return userCreateResolver(args);
            },
        },
        editUser: {
            type: AuthType,
            args: {
                token: { type: graphql.GraphQLString },
                username: { type: graphql.GraphQLString },
                email: { type: graphql.GraphQLString },
                birthDate: { type: graphql.GraphQLString },
            },
            resolve(parent, args) {
                return editUserResolver(args);
            },
        },
        editUserBio: {
            type: AuthType,
            args: {
                token: { type: graphql.GraphQLString },
                bio: { type: graphql.GraphQLString },
                secondarySchool: { type: graphql.GraphQLString },
                primarySchool: { type: graphql.GraphQLString },
            },
            resolve(parent, args) {
                return editUserBioResolver(args);
            },
        },
        editUserLocation: {
            type: AuthType,
            args: {
                token: { type: graphql.GraphQLString },
                location: { type: graphql.GraphQLString },
                hometown: { type: graphql.GraphQLString },
            },
            resolve(parent, args) {
                return editUserLocationResolver(args);
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
