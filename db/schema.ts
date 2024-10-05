import { mysqlTable, serial, varchar, timestamp, text, uniqueIndex } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  emailVerified: timestamp('email_verified'),
  name: varchar('name', { length: 255 }),
  introduction: text('introduction'),
  image: varchar('image', { length: 255 }),
  hashedPassword: varchar('hashed_password', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const accounts = mysqlTable('accounts', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: varchar('expires_at', { length: 255 }),
  tokenType: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  idToken: text('id_token'),
  sessionState: varchar('session_state', { length: 255 }),
}, (table) => ({
  uniqueProviderAccount: uniqueIndex('unique_provider_account').on(table.provider, table.providerAccountId),
}));

export const sessions = mysqlTable('sessions', {
  id: serial('id').primaryKey(),
  sessionToken: varchar('session_token', { length: 255 }).unique().notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
});

export const passwordResetTokens = mysqlTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiry: timestamp('expiry').notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
});

export const verificationTokens = mysqlTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).unique().notNull(),
  expires: timestamp('expires').notNull(),
}, (table) => ({
  uniqueIdentifierToken: uniqueIndex('unique_identifier_token').on(table.identifier, table.token),
}));

// Relations
export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  passwordResetTokens: many(passwordResetTokens),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokenRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));