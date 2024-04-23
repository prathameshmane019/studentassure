"use client"
//  import { useUser } from "@/app/context/UserContext";
function ProfilePage() {
  const user = useUser();
  console.log(user);

  return (
    <div>
      {user ? (
        <div>
          <h1>ID : {user.id}</h1>
          <h1>Department : {user.department}</h1>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

export default ProfilePage;

