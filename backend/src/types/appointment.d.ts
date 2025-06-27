interface IAppointment extends Document {
    userId: Types.ObjectId;
    doctorName: string;
    location: string;
    time: string;
    date: Date;
    status: "Scheduled" | "Completed" | "Cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}
