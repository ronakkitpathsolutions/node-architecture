import { z } from "zod";
import { VALIDATION_MESSAGES } from "../constants/messages.js";

// Common ID validation
export const IdSchema = z.number()
    .int(VALIDATION_MESSAGES.COMMON.ID.INVALID)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE);

// Common pagination schema
export const PaginationSchema = z.object({
    page: z.number()
        .int(VALIDATION_MESSAGES.COMMON.PAGINATION.PAGE_INVALID)
        .positive(VALIDATION_MESSAGES.COMMON.PAGINATION.PAGE_INVALID)
        .default(1),
    limit: z.number()
        .int(VALIDATION_MESSAGES.COMMON.PAGINATION.LIMIT_INVALID)
        .positive(VALIDATION_MESSAGES.COMMON.PAGINATION.LIMIT_INVALID)
        .max(100, VALIDATION_MESSAGES.COMMON.PAGINATION.LIMIT_EXCEEDED)
        .default(10),
    offset: z.number()
        .int(VALIDATION_MESSAGES.COMMON.PAGINATION.OFFSET_INVALID)
        .min(0, VALIDATION_MESSAGES.COMMON.PAGINATION.OFFSET_INVALID)
        .optional()
});

// Common search schema
export const SearchSchema = z.object({
    q: z.string()
        .trim()
        .min(1, VALIDATION_MESSAGES.COMMON.SEARCH.QUERY_EMPTY)
        .max(255, VALIDATION_MESSAGES.COMMON.SEARCH.QUERY_TOO_LONG)
        .optional(),
    fields: z.array(z.string())
        .optional(),
    sort: z.string()
        .optional(),
    order: z.enum(["ASC", "DESC", "asc", "desc"])
        .default("ASC")
        .optional()
});

// Common date range schema
export const DateRangeSchema = z.object({
    startDate: z.string()
        .datetime(VALIDATION_MESSAGES.COMMON.DATE.INVALID_FORMAT)
        .or(z.date())
        .optional(),
    endDate: z.string()
        .datetime(VALIDATION_MESSAGES.COMMON.DATE.INVALID_FORMAT)
        .or(z.date())
        .optional()
}).refine(
    (data) => {
        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return start <= end;
        }
        return true;
    },
    {
        message: VALIDATION_MESSAGES.COMMON.DATE.START_AFTER_END,
        path: ["endDate"]
    }
);

// Common filter schema
export const FilterSchema = z.object({
    ...PaginationSchema.shape,
    ...SearchSchema.shape,
    ...DateRangeSchema.shape,
    status: z.enum(["active", "inactive", "pending", "deleted"])
        .optional(),
    createdBy: IdSchema.optional(),
    updatedBy: IdSchema.optional()
});

// Common response metadata schema
export const ResponseMetaSchema = z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
});

// Common API response schema
export const ApiResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: z.any().optional(),
    meta: ResponseMetaSchema.optional(),
    errors: z.array(z.object({
        field: z.string().optional(),
        message: z.string(),
        code: z.string().optional()
    })).optional()
});

// Email validation
export const EmailSchema = z.string()
    .email(VALIDATION_MESSAGES.USER.EMAIL.INVALID)
    .max(150, VALIDATION_MESSAGES.USER.EMAIL.TOO_LONG)
    .toLowerCase()
    .trim();

// Password validation
export const PasswordSchema = z.string()
    .min(6, VALIDATION_MESSAGES.USER.PASSWORD.TOO_SHORT)
    .max(255, VALIDATION_MESSAGES.USER.PASSWORD.TOO_LONG)
    .refine(
        (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
        VALIDATION_MESSAGES.USER.PASSWORD.WEAK
    );

// Phone number validation
export const PhoneSchema = z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, VALIDATION_MESSAGES.COMMON.PHONE.INVALID_FORMAT)
    .min(10, VALIDATION_MESSAGES.COMMON.PHONE.TOO_SHORT)
    .max(20, VALIDATION_MESSAGES.COMMON.PHONE.TOO_LONG);

// URL validation
export const UrlSchema = z.string()
    .url(VALIDATION_MESSAGES.COMMON.URL.INVALID)
    .max(500, VALIDATION_MESSAGES.COMMON.URL.TOO_LONG);

// File validation
export const FileSchema = z.object({
    filename: z.string().min(1, VALIDATION_MESSAGES.COMMON.FILE.NAME_REQUIRED),
    mimetype: z.string().min(1, VALIDATION_MESSAGES.COMMON.FILE.TYPE_REQUIRED),
    size: z.number()
        .int(VALIDATION_MESSAGES.COMMON.FILE.SIZE_INVALID)
        .positive(VALIDATION_MESSAGES.COMMON.FILE.SIZE_INVALID)
        .max(10 * 1024 * 1024, VALIDATION_MESSAGES.COMMON.FILE.SIZE_EXCEEDED) // 10MB limit
});

// Validation helper functions
export const validateId = (data) => IdSchema.safeParse(data);
export const validatePagination = (data) => PaginationSchema.safeParse(data);
export const validateSearch = (data) => SearchSchema.safeParse(data);
export const validateDateRange = (data) => DateRangeSchema.safeParse(data);
export const validateFilter = (data) => FilterSchema.safeParse(data);
export const validateEmail = (data) => EmailSchema.safeParse(data);
export const validatePassword = (data) => PasswordSchema.safeParse(data);
export const validatePhone = (data) => PhoneSchema.safeParse(data);
export const validateUrl = (data) => UrlSchema.safeParse(data);
export const validateFile = (data) => FileSchema.safeParse(data);
