import React from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Badge, Button } from '../../components/ui'

const USERS = [
  { id: 1, name: 'Rajesh Kumar', role: 'Farmer', status: 'active' },
  { id: 2, name: 'Amit Singh', role: 'Driver', status: 'pending' },
]

export default function AdminUsers() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="User management" subtitle="View and moderate platform users" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-dark-border">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.id} className="border-t border-neutral-200 dark:border-dark-border">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4">
                    <Badge variant={u.status === 'active' ? 'success' : 'warning'}>{u.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}
