# Password Change Tracking System - Frontend Integration

## Overview
This system enforces password changes for imported teachers (guru) by checking their password change status on each dashboard access.

## Components

### 1. Proxy (`src/proxy.ts`)
- **Purpose**: Server-side middleware that runs before page render
- **Function**: Checks password change status and redirects to `/change-password` if needed
- **Routes Protected**: All dashboard routes (`/dashboard`, `/siswa`, `/guru`, etc.)
- **Routes Excluded**: `/change-password`, `/api`, `/login`, etc.

### 2. Password Check Hook (`src/hooks/usePasswordCheck.ts`)
- **`usePasswordCheck()`**: SWR hook to check if user needs password change
- **`usePasswordRequirements()`**: Get password complexity requirements
- **`changePassword()`**: Function to change user password

### 3. Password Guard Component (`src/components/guards/PasswordGuard.tsx`)
- **Purpose**: Client-side fallback protection
- **Usage**: Wraps dashboard components to ensure password check
- **Behavior**: Redirects to change password page if needed

### 4. Change Password Page (`src/app/change-password/page.tsx`)
- **Route**: `/change-password`
- **Features**: 
  - Form validation with password requirements
  - Loading states and error handling
  - Automatic redirect to dashboard after success

## Usage Examples

### Protecting Dashboard Pages
```tsx
// Option 1: Use PasswordGuard directly
import { PasswordGuard } from '@/components/guards/PasswordGuard';

export default function SomeDashboardPage() {
  return (
    <PasswordGuard>
      <div>Your protected content</div>
    </PasswordGuard>
  );
}

// Option 2: Use DashboardLayout wrapper
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function SomeDashboardPage() {
  return (
    <DashboardLayout>
      <div>Your protected content</div>
    </DashboardLayout>
  );
}
```

### Using Password Check Hook
```tsx
import { usePasswordCheck } from '@/hooks/usePasswordCheck';

function MyComponent() {
  const { needsPasswordChange, userRole, isLoading } = usePasswordCheck();
  
  if (needsPasswordChange) {
    return <div>Redirecting to change password...</div>;
  }
  
  return <div>Normal content</div>;
}
```

## Security Flow

1. **Import Teacher**: Teacher imported with `is_changed_password = false`
2. **Dashboard Access**: Proxy checks password status via API
3. **Redirect**: If `needs_change = true`, redirect to `/change-password`
4. **Change Password**: User fills form and submits
5. **Update Flag**: Backend sets `is_changed_password = true`
6. **Dashboard Access**: User can now access dashboard normally

## Environment Variables Required

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints Used

- `GET /api/auth/password-check` - Check password status (authenticated)
- `POST /api/auth/change-password` - Change password (authenticated)
- `GET /api/password-requirements` - Get password rules (public)

## Error Handling

- **Network errors**: Gracefully handled, allows request to continue
- **Authentication errors**: Redirects to login page
- **Form validation**: Real-time validation with error messages
- **API errors**: Toast notifications with error details

## Testing

1. Import a teacher via Excel
2. Login as that teacher
3. Should be redirected to change password page
4. Change password successfully
5. Should be redirected to dashboard
6. Subsequent logins should go directly to dashboard