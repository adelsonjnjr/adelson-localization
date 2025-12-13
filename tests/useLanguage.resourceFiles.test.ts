import { deepMerge } from '../src/objectHelpers';

describe('useLanguage - Multiple Resource Files Support', () => {
  it('should merge multiple translation files correctly', () => {
    // Simulate loading multiple translation files
    const commonFile = {
      common: {
        hello: 'Hello',
        goodbye: 'Goodbye'
      }
    };

    const authFile = {
      auth: {
        login: 'Login',
        logout: 'Logout'
      }
    };

    const dashboardFile = {
      dashboard: {
        welcome: 'Welcome to Dashboard'
      }
    };

    // Merge files as useLanguage would do
    const merged = deepMerge({}, commonFile, authFile, dashboardFile);

    // Verify all keys are present
    expect(merged).toHaveProperty('common');
    expect(merged).toHaveProperty('auth');
    expect(merged).toHaveProperty('dashboard');
    expect(merged.common.hello).toBe('Hello');
    expect(merged.auth.login).toBe('Login');
    expect(merged.dashboard.welcome).toBe('Welcome to Dashboard');
  });

  it('should merge nested objects from different files', () => {
    const baseFile = {
      app: {
        title: 'My App',
        version: '1.0'
      }
    };

    const extendedFile = {
      app: {
        author: 'John Doe',
        description: 'A great app'
      },
      user: {
        profile: 'Profile'
      }
    };

    const merged = deepMerge({}, baseFile, extendedFile);

    // All app keys should be merged
    expect(merged.app.title).toBe('My App');
    expect(merged.app.version).toBe('1.0');
    expect(merged.app.author).toBe('John Doe');
    expect(merged.app.description).toBe('A great app');
    expect(merged.user.profile).toBe('Profile');
  });

  it('should handle overlapping keys with later files overwriting earlier ones', () => {
    const file1 = {
      config: {
        timeout: 5000,
        retries: 3
      }
    };

    const file2 = {
      config: {
        timeout: 10000 // Override
      }
    };

    const merged = deepMerge({}, file1, file2);

    // Later file should override
    expect(merged.config.timeout).toBe(10000);
    // Original value should be preserved
    expect(merged.config.retries).toBe(3);
  });

  it('should handle empty files gracefully', () => {
    const file1 = {
      data: { value: 'test' }
    };

    const file2 = {};

    const merged = deepMerge({}, file1, file2);

    expect(merged.data.value).toBe('test');
  });

  it('should simulate real-world multi-module structure', () => {
    // Common translations
    const common = {
      buttons: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete'
      }
    };

    // Auth module
    const auth = {
      login: {
        title: 'Login',
        username: 'Username',
        password: 'Password'
      }
    };

    // Dashboard module
    const dashboard = {
      dashboard: {
        welcome: 'Welcome back!',
        stats: 'Statistics'
      }
    };

    const merged = deepMerge({}, common, auth, dashboard);

    // All modules should be accessible
    expect(merged.buttons.save).toBe('Save');
    expect(merged.login.title).toBe('Login');
    expect(merged.dashboard.welcome).toBe('Welcome back!');
  });
});
