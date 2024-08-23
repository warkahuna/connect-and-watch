import React from "react";

const UserList: React.FC<{
  users: { username: string; id: string }[];
  onRemove: (id: string) => void;
}> = ({ users, onRemove }) => {
  return (
    <div>
      <h3>Users in Room</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username}
            <button onClick={() => onRemove(user.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
