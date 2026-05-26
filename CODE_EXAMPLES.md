# Code Examples

## Authentication Example

### Frontend (React)
```jsx
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Backend (Laravel)
```php
Route::post('/auth/login', [AuthController::class, 'login']);

class AuthController {
    public function login(LoginRequest $request) {
        if (!Auth::attempt($request->validated())) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        
        $user = Auth::user();
        return response()->json(['token' => $user->createToken('auth')->plainTextToken]);
    }
}
```

## API Call Example

### Fetching Alumni List
```jsx
const [alumni, setAlumni] = useState([]);

useEffect(() => {
  axios.get('/api/alumni')
    .then(res => setAlumni(res.data))
    .catch(err => console.error(err));
}, []);
```

### Creating Connection Request
```jsx
const sendConnectionRequest = async (alumniId) => {
  try {
    await axios.post('/api/connections', { recipient_id: alumniId });
    toast.success('Connection request sent');
  } catch (err) {
    toast.error('Failed to send request');
  }
};
```

## Database Query Example

### Eloquent Query
```php
// Get all alumni with their skills
$alumni = Alumni::with('user.skills')
    ->where('company', 'Google')
    ->paginate(15);

// Get mentorship requests for student
$requests = MentorRequest::where('student_id', auth()->id())
    ->with('mentor.user')
    ->latest()
    ->get();
```
