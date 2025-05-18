import { ZodError } from "zod";
import { authModule } from "../../../modules/auth/auth-module";
import { QueryRuleProps } from "../types/common-types";

type AnyObject = Record<string, any>;

export const buildQueryFromRules = (
    queryParams: Record<string, any>,
    rules: QueryRuleProps[]
): Record<string, any> => {
    const query: Record<string, any> = {};

    for (const rule of rules) {
        const value = queryParams[rule.key];

        if (value === undefined) continue;

        const field = rule.field || rule.key;

        switch (rule.type) {
            case 'string':
                query[field] = value;
                break;

            case 'boolean':
                query[field] = value === 'true';
                break;

            case 'array':
                query[field] = { $in: value.split(',') };
                break;

            case 'regex':
                query[field] = { $regex: new RegExp(value, 'i') };
                break;

            case 'search':
                const keywordRegex = new RegExp(value, 'i');
                query['$or'] = [
                    { title: keywordRegex },
                    { content: keywordRegex },
                    { tags: keywordRegex },
                    { categories: keywordRegex },
                ];
                break;

            case 'limit':
                const limit = parseInt(value, 10) || 10;
                query.$limit = limit;
                break;

            case 'page':
                const page = parseInt(value, 10) || 1;
                const skip = (page - 1) * query.$limit;
                query.$skip = skip;
                break;
        }
    }

    return query;
};


export const createPayload = (data: AnyObject, fields: string[]): AnyObject => {
    const result: AnyObject = {};

    for (const field of fields) {
        const keys = field
            .replace(/\[(\w+)\]/g, '.$1')
            .split('.');

        let source = data;
        let target = result;
        let lastKey = keys[keys.length - 1];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (i === keys.length - 1) {
                target[key] = source?.[key] ?? '';
            } else {
                source = source?.[key];
                if (source === undefined) break;

                if (!target[key]) target[key] = {};
                target = target[key];
            }
        }
    }

    return result;
};


export const sluggify = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const sanitizeArray = (arr: any[]) =>
    Array.isArray(arr)
        ? [...new Set(arr.map((item) => String(item).trim()).filter(Boolean))]
        : [];

export const handleUserExistence = async ({
    username,
    throwUserExistsError = false,
    throwNoUserExistsError = false,
    throwUserNotVerifiedError = false,
    throwUserVerifiedError = false,
}: {
    username: string;
    throwUserExistsError?: boolean;
    throwNoUserExistsError?: boolean;
    throwUserNotVerifiedError?: boolean;
    throwUserVerifiedError?: boolean;
}) => {
    const user = await authModule.services.user.findUserByUsername({ username });
    const userExists = !!user;

    if (userExists) {
        if (throwUserExistsError) {
            throw new Error("User already exists");
        }
        if (!user.is_verified && throwUserNotVerifiedError) {
            throw new Error("User not verified");
        }
        if (user.is_verified && throwUserVerifiedError) {
            throw new Error("User already verified");
        }
        return {
            user,
        };
    } else {
        if (throwNoUserExistsError) {
            throw new Error(`User does not exist`);
        }
        return {
            user,
        };
    }
};

export const formatValidationErrors = (errors: ZodError['issues']): Record<string, string> => {
    const formattedErrors: Record<string, string> = {};
    errors.forEach((issue: any) => {
        const path = issue.path.join('.');
        formattedErrors[path] = issue.message;
    });

    return formattedErrors;
};
