'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface User {
    _id: string
    fullname: string
    role: 'client' | 'staff' | string
}

const formSchema = z.object({
    client: z.string().min(1, 'Client is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    staff: z.string().min(1, 'Staff is required'),
    visitType: z.string().min(1, 'Visit Type is required'),
    notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddVisitProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    handleAddVisit: (data: FormValues) => void
}

const AddVisit: React.FC<AddVisitProps> = ({ open, onOpenChange, handleAddVisit }) => {
    const [users, setUsers] = useState<User[]>([])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client: '',
            date: '',
            time: '',
            staff: '',
            visitType: '',
            notes: '',
        },
    })

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmEzNzdjNjA0NDRiZjIzZjQ5NjdlMSIsImlhdCI6MTc0NTQ4MzM5NiwiZXhwIjoxNzQ2MDg4MTk2fQ.3rkvLVFUpNcwZoSTHdry-VCkLujRiNu3Gax_rWHwmv0"

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/all-user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                const result = await response.json()
                if (result.status && Array.isArray(result.data)) {
                    setUsers(result.data)
                }
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }

        fetchUsers()
    }, [])

    const onSubmit = (data: FormValues) => {
        handleAddVisit(data)
        onOpenChange(false)
        form.reset()
        console.log('Form submitted:', data)
    }

    const clients = users.filter(user => user.role === 'client')
    const staff = users.filter(user => user.role === 'staff')


    console.log('Clients:', clients)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <div className="bg-[#0a1172] text-white p-1 rounded-full mr-2">
                            <Eye className="h-5 w-5" />
                        </div>
                        Add New Visit
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">

                        <FormField
                            control={form.control}
                            name="client"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Client" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {clients.map(client => (
                                                <SelectItem key={client._id} value={client._id}>
                                                    {client.fullname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="staff"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Staff</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Staff" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {staff.map(staffUser => (
                                                <SelectItem key={staffUser._id} value={staffUser._id}>
                                                    {staffUser.fullname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="visitType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visit Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Visit Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="follow-up">Follow-up</SelectItem>
                                            <SelectItem value="routine">Routine Check</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Add notes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="bg-[#0a1172] hover:bg-[#1a2182] text-white"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddVisit
